/* eslint-disable @typescript-eslint/no-unused-expressions */
import { customElement, observable } from '@microsoft/fast-element';
import { DrawerEvents, IPoint } from '../../../common/drawer-canvas/drawer-canvas.definitions';
import { guid } from '../../../common/utils/guid';
import { DrawingColors } from '../../../styles/system-providers/ava-design-system-provider.definitions';
import { UIActionType } from '../../../web-components/src/actions-menu/actions-menu.definitions';
import { LayerLabelComponent } from '../../../web-components/src/layer-label/layer-label.component';
import { LineDrawerComponent } from '../../../web-components/src/line-drawer/line-drawer.component';
import { PolygonDrawerComponent } from '../../../web-components/src/polygon-drawer/polygon-drawer.component';
import { styles } from './zone-drawer.style';
import { template } from './zone-drawer.template';
import { ZonesViewComponent } from '../../../web-components/src/zones-view/zones-view.component';
import { BaseWidget } from '../base-widget/base-widget';
import { Player } from './../player/player-widget';
import { ZoneDrawerActions } from './actions';
import {
    ILayerLabelConfig,
    ILayerLabelOutputEvent,
    LayerLabelEvents,
    LayerLabelMode
} from '../../../web-components/src/layer-label/layer-label.definitions';
import {
    IZone,
    IZoneDrawerWidgetConfig,
    ZoneDrawerWidgetEvents,
    IZoneTemplate,
    ILineZone,
    IPolygonZone,
    ZoneDrawerMode
} from './zone-drawer.definitions';
import { Logger } from '../common/logger';
import { AvaDesignSystemProvider } from '../../../styles';
import { Localization } from './../../../common/services/localization/localization.class';

AvaDesignSystemProvider;
ZonesViewComponent;
PolygonDrawerComponent;
LineDrawerComponent;
LayerLabelComponent;
Localization;

export const LocalizationService = Localization;

@customElement({
    name: 'ava-zone-drawer',
    template,
    styles
})
export class ZoneDrawer extends BaseWidget {
    @observable
    public zones: IZone[] = [];
    @observable
    public isReady = false;
    @observable
    public isDirty = false;
    @observable
    public showDrawer = true;
    @observable
    public isLineDrawMode = true;
    @observable
    public isLabelsListEmpty = true;
    @observable
    public disableDrawing = false;

    public config: IZoneDrawerWidgetConfig = {};

    private readonly MAX_ZONES = 10;

    private zonesView: ZonesViewComponent;
    private lineDrawer: LineDrawerComponent;
    private polygonDrawer: PolygonDrawerComponent;
    private labelsList: HTMLElement;
    private player: Player;
    private labelListIndex = 1;
    private resizeObserver: ResizeObserver;

    public constructor(config: IZoneDrawerWidgetConfig) {
        super(config);
    }

    public connectedCallback() {
        super.connectedCallback();

        this.validateOrAddDesignSystem();
        this.isReady = true;
        const parent = this.$fastController?.element?.parentElement;
        this.resizeObserver = new ResizeObserver(() =>
            window.requestAnimationFrame(() => {
                this.resize();
            })
        );
        this.resizeObserver.observe(parent || this.$fastController?.element);
    }

    public disconnectedCallback() {
        super.disconnectedCallback();

        this.resizeObserver.disconnect();
    }

    public load() {
        if (this.isReady) {
            this.zones = [];
            this.initZoneDrawComponents();
            this.removeAllLabels();
            this.labelListIndex = 1;
            this.init();
        }
    }

    public removeAllLabels() {
        while (this.labelsList?.firstElementChild) {
            this.removeLabel(this.labelsList.firstElementChild.id);
        }
    }

    public drawerConnectedCallback() {
        setTimeout(() => {
            this.initDrawer();
        });
    }

    public save() {
        const outputs = this.getZonesOutputs();
        this.$emit(ZoneDrawerWidgetEvents.SAVE, outputs);
        Logger.log(outputs);
    }

    public toggleDrawerMode() {
        this.destroyDrawer();
        this.isLineDrawMode = !this.isLineDrawMode;
    }

    public configure(config?: IZoneDrawerWidgetConfig) {
        this.config = config;
        if (this.config?.debug) {
            this.setDebugMode(this.config?.debug);
        }

        this.setLocalization(this.config?.locale, ['common', 'zone-drawer']);
        ZoneDrawerActions.forEach((e)=> {
            e.label = LocalizationService.resolve(`ZONE_DRAWER_Actions_${e.type}`);
        });
    }

    // @override
    protected init() {
        this.isDirty = false;

        if (this.zonesView?.zones?.length) {
            this.zonesView.zones = [];
        }

        if (this.zones.length) {
            this.zonesView.zones = [...this.zones];
            this.isLabelsListEmpty = false;
        }

        if (this.config?.zones) {
            for (const zone of this.config.zones) {
                this.addZone(this.convertTemplateToZone(zone));
            }
        }

        this.disableDrawing = !!this.config?.disableDrawing;
    }

    private convertTemplateToZone(zoneTemplate: IPolygonZone | ILineZone) {
        let zone: IZone = null;
        if ((zoneTemplate as IPolygonZone).polygon) {
            // Zone is polygon
            const currentZone = zoneTemplate as IPolygonZone;
            zone = {
                points: [...currentZone.polygon],
                name: currentZone.name,
                id: guid(),
                color: this.getNextColor(),
                type: ZoneDrawerMode.Polygon
            };
        } else {
            // Zone is line
            const currentZone = zoneTemplate as ILineZone;
            zone = {
                points: [...currentZone.line],
                name: currentZone.name,
                id: guid(),
                color: this.getNextColor(),
                type: ZoneDrawerMode.Line
            };
        }

        return zone;
    }

    private initZoneDrawComponents() {
        if (!this.zonesView) {
            this.zonesView = this.shadowRoot.querySelector('media-zones-view');
        }

        if (!this.labelsList) {
            this.labelsList = this.shadowRoot.querySelector('.labels-list');
        }

        if (!this.player) {
            this.player = this.$fastController.element.querySelector('ava-player');
        }
    }

    private initDrawer() {
        if (this.isLineDrawMode) {
            if (this.lineDrawer) {
                return;
            }
            this.lineDrawer = this.shadowRoot.querySelector('media-line-drawer');

            this.lineDrawer?.setAttribute('borderColor', this.getNextColor());
            // eslint-disable-next-line no-undef
            this.lineDrawer?.addEventListener(DrawerEvents.COMPLETE, this.drawerComplete.bind(this) as EventListener);
        } else {
            // init polygon drawer
            this.polygonDrawer = this.shadowRoot.querySelector('media-polygon-drawer');

            this.polygonDrawer?.setAttribute('borderColor', this.getNextColor());
            // eslint-disable-next-line no-undef
            this.polygonDrawer?.addEventListener(DrawerEvents.COMPLETE, this.drawerComplete.bind(this) as EventListener);
        }
    }

    private destroyDrawer() {
        if (this.isLineDrawMode) {
            // eslint-disable-next-line no-undef
            this.lineDrawer?.removeEventListener(DrawerEvents.COMPLETE, this.drawerComplete as EventListener);
            this.lineDrawer = null;
        } else {
            // eslint-disable-next-line no-undef
            this.polygonDrawer?.removeEventListener(DrawerEvents.COMPLETE, this.drawerComplete as EventListener);
            this.polygonDrawer = null;
        }
    }

    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
    private drawerComplete(e: CustomEvent<IPoint[]>) {
        this.createZone([...e.detail]);
    }

    private resize() {
        if (this.labelsList) {
            const playerContainer = this.shadowRoot.querySelector('.player-widget-container');
            this.labelsList.style.maxHeight = `${playerContainer.clientHeight}px`;
        }
    }

    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
    private labelActionClicked(e: any) {
        switch (e.detail?.type) {
            case UIActionType.RENAME:
                this.renameZone(e.detail.id);
                return;
            case UIActionType.DELETE:
                this.deleteZone(e.detail.id);
                return;
        }
    }

    private labelTextChanged(e: CustomEvent<ILayerLabelOutputEvent>) {
        for (const zone of this.zones) {
            if (zone.id === e.detail.id) {
                zone.name = e.detail.name;
                return;
            }
        }
    }

    private createZone(points: IPoint[]) {
        const zone: IZone = {
            id: guid(),
            type: this.isLineDrawMode ? ZoneDrawerMode.Line : ZoneDrawerMode.Polygon,
            name: this.getNewZoneName(),
            color: this.getNextColor(),
            points: [...points]
        };

        this.addZone(zone);
    }

    private addZone(newZone: IZone) {
        const zone: IZone = {
            id: newZone.id || guid(),
            name: newZone.name || this.getNewZoneName(),
            color: newZone.color || this.getNextColor(),
            points: [...newZone.points],
            type: newZone.type ? newZone.type : newZone.points.length === 2 ? ZoneDrawerMode.Line : ZoneDrawerMode.Polygon
        };

        this.zones.push(zone);
        if (this.zonesView) {
            this.zonesView.zones = [...this.zones];
        }

        if (this.lineDrawer) {
            this.lineDrawer.borderColor = this.getNextColor();
        } else {
            this.polygonDrawer?.setAttribute('borderColor', this.getNextColor());
        }

        if (this.zones.length === this.MAX_ZONES) {
            this.showDrawer = false;
            this.destroyDrawer();
        }

        this.isLabelsListEmpty = false;
        this.isDirty = true;
        const output = this.getZoneOutputByType(zone.type, zone.name, zone.points);
        this.$emit(ZoneDrawerWidgetEvents.ADDED_ZONE, output);
        this.addLabel(zone);
    }

    private deleteZone(id: string) {
        const deletedZone = this.zones.find((zone) => zone.id === id);
        this.zones = this.zones.filter((zone) => zone.id !== id);
        this.zonesView.zones = [...this.zones];
        this.removeLabel(id);
        this.isLabelsListEmpty = !this.zones.length;

        if (!this.showDrawer) {
            this.showDrawer = true;
        }
        const output = this.getZoneOutputByType(deletedZone.type, deletedZone.name, deletedZone.points);
        this.$emit(ZoneDrawerWidgetEvents.REMOVED_ZONE, output);
    }

    private getNewZoneName(): string {
        return `${this.isLineDrawMode ? 'Line' : 'Zone'} ${this.labelListIndex++}`;
    }

    private getNextColor(): string {
        for (const color of Object.values(DrawingColors)) {
            const zone = this.zones.filter((a) => a.color === color);
            if (!zone.length) {
                return color;
            }
        }
        return '';
    }

    private addLabel(zone: IZone) {
        const li = window.document.createElement('li');
        const layerLabel = <LayerLabelComponent>window.document.createElement('media-layer-label');
        li.id = zone.id;
        layerLabel.config = this.getLabelConfig(zone);
        li.appendChild(layerLabel);
        this.labelsList.appendChild(li);
        this.resize();
        // eslint-disable-next-line no-undef
        layerLabel.addEventListener(LayerLabelEvents.labelActionClicked, this.labelActionClicked.bind(this) as EventListener);
        // eslint-disable-next-line no-undef
        layerLabel.addEventListener(LayerLabelEvents.labelTextChanged, this.labelTextChanged.bind(this) as EventListener);
    }

    private renameZone(id: string) {
        const li = this.shadowRoot.getElementById(id);
        const layerLabel = <LayerLabelComponent>li.querySelector('media-layer-label');
        layerLabel.editMode = true;
    }

    private removeLabel(id: string) {
        const li = this.shadowRoot.getElementById(id);
        if (li) {
            const layerLabel = <LayerLabelComponent>li.querySelector('media-layer-label');
            // eslint-disable-next-line no-undef
            layerLabel?.removeEventListener(LayerLabelEvents.labelActionClicked, this.labelActionClicked as EventListener);
            // eslint-disable-next-line no-undef
            layerLabel?.removeEventListener(LayerLabelEvents.labelTextChanged, this.labelTextChanged as EventListener);

            this.labelsList.removeChild(li);
        }
    }

    private getLabelConfig(zone: IZone): ILayerLabelConfig {
        return {
            id: zone.id,
            label: zone.name,
            color: zone.color,
            mode: LayerLabelMode.Actions,
            actions: ZoneDrawerActions
        };
    }

    private getZonesOutputs(): IZoneTemplate[] {
        const outputs: IZoneTemplate[] = [];
        for (const zone of this.zones) {
            let output: ILineZone | IPolygonZone;
            if (zone.points.length === 2) {
                // ILineZone
                output = this.getZoneOutputByType(zone.type, zone.name, zone.points);
            } else {
                // IPolygonZone
                output = this.getZoneOutputByType(zone.type, zone.name, zone.points);
            }
            outputs.push(output);
        }
        return outputs;
    }

    private getZoneOutputByType(type: ZoneDrawerMode, name: string, points: IPoint[]): ILineZone | IPolygonZone {
        let output: ILineZone | IPolygonZone;
        // Go over points and remove the cursor
        const newPoints: IPoint[] = [];
        for (const point of points) {
            newPoints.push({
                x: point.x,
                y: point.y
            });
        }
        switch (type) {
            case ZoneDrawerMode.Line:
                output = {
                    '@type': '#Microsoft.VideoAnalyzer.NamedLineString',
                    name: name,
                    line: newPoints
                };
                break;
            case ZoneDrawerMode.Polygon:
                output = {
                    '@type': '#Microsoft.VideoAnalyzer.NamedPolygonString',
                    name: name,
                    polygon: newPoints
                };
                break;
        }
        return output;
    }
}
