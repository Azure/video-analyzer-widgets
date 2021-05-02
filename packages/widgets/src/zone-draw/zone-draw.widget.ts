import { customElement, attr, FASTElement, observable } from '@microsoft/fast-element';
import { DrawerEvents, IPoint } from '../../../common/drawer-canvas/drawer-canvas.definitions';
import { guid } from '../../../common/utils/guid';
import { DrawingColors } from '../../../styles/system-providers/ava-design-system-provider.definitions';
import { UIActionType } from '../../../web-components/src/actions-menu/actions-menu.definitions';
import { LayerLabelComponent } from '../../../web-components/src/layer-label/layer-label.component';
import { ILayerLabelConfig, LayerLabelEvents, LayerLabelMode } from '../../../web-components/src/layer-label/layer-label.definitions';
import { LineDrawerComponent } from '../../../web-components/src/line-drawer/line-drawer.component';
import { PolygonDrawerComponent } from '../../../web-components/src/polygon-drawer/polygon-drawer.component';
import { ZoneDrawMode, IZone, IZoneDrawWidgetConfig, IZoneOutput, ZoneDrawEvents } from './zone-draw.definitions';
import { styles } from './zone-draw.style';
import { template } from './zone-draw.template';
import { ZonesViewComponent } from './../../../web-components/src/zones-view/zones-view.component';
import { DELETE_SVG_PATH, RENAME_SVG_PATH } from '../../../styles/svg/svg.shapes';

@customElement({
    name: 'zone-draw-widget',
    template,
    styles
})
export class ZoneDrawWidget extends FASTElement {
    @attr
    public config: IZoneDrawWidgetConfig;

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

    public zoneDrawMode = ZoneDrawMode.Line;

    private readonly MAX_ZONES = 10;

    private zonesView: ZonesViewComponent;
    private lineDrawer: LineDrawerComponent;
    private polygonDrawer: PolygonDrawerComponent;
    private labelsList: HTMLElement;
    private labelListIndex = 1;

    public constructor() {
        super();
    }

    public connectedCallback() {
        super.connectedCallback();

        this.isReady = true;
        this.initZoneDrawComponents();

        window.addEventListener('resize', this.resize.bind(this));
        this.$fastController?.element?.addEventListener(LayerLabelEvents.labelActionClicked, this.labelActionClicked.bind(this));
        this.$fastController?.element?.addEventListener(LayerLabelEvents.labelTextChanged, this.labelTextChanged.bind(this));
    }

    public disconnectedCallback() {
        super.disconnectedCallback();

        window.removeEventListener('resize', this.resize);
        this.$fastController?.element?.removeEventListener(LayerLabelEvents.labelActionClicked, this.labelActionClicked);
        this.$fastController?.element?.removeEventListener(LayerLabelEvents.labelTextChanged, this.labelTextChanged);
    }

    public configChanged() {
        setTimeout(() => {
            if (this.isReady) {
                this.initZoneDrawComponents();
            }
        });
    }

    public drawerConnectedCallback() {
        setTimeout(() => {
            this.initDrawer();
        });
    }

    public save() {
        const outputs = this.getZonesOutputs();
        /* eslint-disable-next-line  no-console */
        console.log('save', outputs);
        this.$emit(ZoneDrawEvents.Save, outputs);
    }

    public toggleDrawMode() {
        this.destroyDrawer();
        this.isLineDrawMode = !this.isLineDrawMode;
    }

    private initZoneDrawComponents() {
        if (!this.labelsList) {
            this.labelsList = this.shadowRoot.querySelector('.labels-list');
        }

        this.initZones();
    }

    private initDrawer() {
        if (this.isLineDrawMode) {
            if (this.lineDrawer) {
                return;
            }
            this.lineDrawer = this.shadowRoot.querySelector('media-line-drawer');

            this.lineDrawer?.setAttribute('borderColor', this.getNextColor());

            this.lineDrawer?.addEventListener(DrawerEvents.COMPLETE, this.drawerComplete.bind(this));
        } else {
            // init polygon drawer
            this.polygonDrawer = this.shadowRoot.querySelector('media-polygon-drawer');

            this.polygonDrawer?.setAttribute('borderColor', this.getNextColor());

            this.polygonDrawer?.addEventListener(DrawerEvents.COMPLETE, this.drawerComplete.bind(this));
        }
    }

    private destroyDrawer() {
        if (this.isLineDrawMode) {
            this.lineDrawer?.removeEventListener(DrawerEvents.COMPLETE, this.drawerComplete);
            this.lineDrawer = null;
        } else {
            this.polygonDrawer?.removeEventListener(DrawerEvents.COMPLETE, this.drawerComplete);
            this.polygonDrawer = null;
        }
    }

    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
    private drawerComplete(e: any) {
        this.createZone([...e.detail]);
    }

    private resize() {
        const rvxContainer = this.shadowRoot.querySelector('.rvx-widget-container');
        this.labelsList.style.maxHeight = `${rvxContainer.clientHeight}px`;
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

    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
    private labelTextChanged(e: any) {
        for (const zone of this.zones) {
            if (zone.id === e.detail.id) {
                zone.name = e.detail.name;
                return;
            }
        }
    }

    private initZones() {
        if (this.config) {
            for (const zone of this.config.zones) {
                this.addZone(zone);
            }
        }

        this.isDirty = false;
        if (!this.zonesView) {
            this.zonesView = this.shadowRoot.querySelector('media-zones-view');
        }

        if (this.zones.length) {
            this.zonesView.zones = [...this.zones];
        }
    }

    private createZone(points: IPoint[]) {
        const zone: IZone = {
            id: guid(),
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
            points: [...newZone.points]
        };

        this.zones.push(zone);
        this.zonesView.zones = [...this.zones];

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

        this.addLabel(zone);
    }

    private deleteZone(id: string) {
        this.zones = this.zones.filter((zone) => zone.id !== id);
        this.zonesView.zones = [...this.zones];
        this.removeLabel(id);
        this.isLabelsListEmpty = this.zones.length === 0;

        if (!this.showDrawer) {
            this.showDrawer = true;
        }
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
    }

    private renameZone(id: string) {
        const li = this.shadowRoot.getElementById(id);
        const layerLabel = <LayerLabelComponent>li.querySelector('media-layer-label');
        layerLabel.editMode = true;
    }

    private removeLabel(id: string) {
        const li = this.shadowRoot.getElementById(id);
        this.labelsList.removeChild(li);
    }

    private getLabelConfig(zone: IZone): ILayerLabelConfig {
        return {
            id: zone.id,
            label: zone.name,
            color: zone.color,
            mode: LayerLabelMode.Actions,
            actions: [
                {
                    label: 'Rename',
                    svgPath: RENAME_SVG_PATH,
                    type: UIActionType.RENAME
                },
                {
                    label: 'Delete',
                    svgPath: DELETE_SVG_PATH,
                    type: UIActionType.DELETE
                }
            ]
        };
    }

    private getZonesOutputs(): IZoneOutput[] {
        const outputs: IZoneOutput[] = [];
        for (const zone of this.zones) {
            const output: IZoneOutput = {
                '@type': '#Microsoft.VideoAnalyzer',
                name: zone.name
            };

            if (zone.points.length === 2) {
                output['@type'] += '.NamedLineString';
                output.line = zone.points;
            } else {
                output['@type'] += '.NamedPolygonString';
                output.polygon = zone.points;
            }

            outputs.push(output);
        }

        return outputs;
    }
}
