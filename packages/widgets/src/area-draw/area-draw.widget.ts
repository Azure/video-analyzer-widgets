import { customElement, attr, FASTElement, observable } from '@microsoft/fast-element';
import { IPoint } from '../../../common/drawer-canvas/drawer-canvas.definitions';
import { guid } from '../../../common/utils/guid';
import { DELETE_SVG_PATH, RENAME_SVG_PATH } from '../../../styles/svg/svg-shapes';
import { DrawingColors } from '../../../styles/system-providers/ava-design-system-provider.definitions';
import { UIActionType } from '../../../web-components/src/actions-menu/actions-menu.definitions';
import { AreasViewComponent } from '../../../web-components/src/areas-view/areas-view.component';
import { LayerLabelComponent } from '../../../web-components/src/layer-label/layer-label.component';
import { ILayerLabelConfig, LayerLabelMode } from '../../../web-components/src/layer-label/layer-label.definitions';
import { LineDrawerComponent } from '../../../web-components/src/line-drawer/line-drawer.component';
import { AreaDrawMode, IArea, IAreaDrawWidgetConfig, IAreaOutput } from './area-draw.definitions';
import { styles } from './area-draw.style';
import { template } from './area-draw.template';

@customElement({
    name: 'area-draw-widget',
    template,
    styles
})
export class AreaDrawWidget extends FASTElement {
    @attr
    public config: IAreaDrawWidgetConfig;

    @observable
    public areas: IArea[] = [];
    @observable
    public isReady = false;
    @observable
    public isDirty = false;
    @observable
    showDrawer = true;
    @observable
    isLineDrawMode = true;
    @observable
    isLabelsListEmpty = true;

    public areaDrawMode = AreaDrawMode.Line;

    private readonly MAX_AREAS = 10;

    private areasView: AreasViewComponent;
    private lineDrawer: LineDrawerComponent;
    private labelsList: HTMLElement;
    private labelListIndex = 1;

    public constructor() {
        super();
    }

    // Only after creation of the template, the canvas element is created and assigned to DOM
    public connectedCallback() {
        super.connectedCallback();

        this.isReady = true;
        this.initAreaDrawComponents();
        window.addEventListener('resize', () => {
            const rvxContainer = this.shadowRoot.querySelector('.rvx-widget-container');
            this.labelsList.style.maxHeight = `${rvxContainer.clientHeight}px`;
        });
    }

    public configChanged() {
        setTimeout(() => {
            if (this.isReady) {
                this.initAreaDrawComponents();
            }
        });
    }

    public lineDrawerConnectedCallback() {
        console.log('lineDrawerConnectedCallback');
        setTimeout(() => {
            this.initDrawer();
        });
    }

    private initAreaDrawComponents() {
        if (!this.labelsList) {
            this.labelsList = this.shadowRoot.querySelector('.labels-list');
        }

        this.initAreas();
    }

    public close() {
        console.log('close');
    }
    public save() {
        console.log('save');
        console.log(this.getAreasOutputs());
    }
    public done() {
        console.log('done');
        console.log(this.getAreasOutputs());
    }

    private initDrawer() {
        if (this.isLineDrawMode) {
            if (this.lineDrawer) {
                return;
            }
            this.lineDrawer = this.shadowRoot.querySelector('media-line-drawer');

            this.lineDrawer?.setAttribute('borderColor', this.getNextColor());

            this.lineDrawer?.addEventListener('drawerComplete', this.drawerComplete.bind(this));
        } else {
            // init polygon drawer
        }
    }

    private destroyDrawer() {
        if (this.isLineDrawMode) {
            this.lineDrawer?.removeEventListener('drawerComplete', this.drawerComplete);
            this.lineDrawer = null;
        } else {
            // destroy polygon drawer
        }
    }

    private drawerComplete(e: any) {
        console.log(e.detail);
        this.createArea([...e.detail]);
    }

    public toggleDrawMode() {
        this.isLineDrawMode = !this.isLineDrawMode;
    }

    private initAreas() {
        if (this.config) {
            for (const area of this.config.areas) {
                this.addArea(area);
            }
        }

        this.isDirty = false;
        if (!this.areasView) {
            this.areasView = this.shadowRoot.querySelector('media-areas-view');
        }

        if (this.areas.length) {
            this.areasView.areas = [...this.areas];
        }
    }

    private createArea(points: IPoint[]) {
        const area: IArea = {
            id: guid(),
            name: this.getNewAreaName(),
            color: this.getNextColor(),
            points: [...points]
        };

        this.addArea(area);
    }

    private addArea(newArea: IArea) {
        const area: IArea = {
            id: newArea.id || guid(),
            name: newArea.name || this.getNewAreaName(),
            color: newArea.color || this.getNextColor(),
            points: [...newArea.points]
        };

        this.areas.push(area);
        this.areasView.areas = [...this.areas];

        if (this.lineDrawer) {
            this.lineDrawer.borderColor = this.getNextColor();
        }

        if (this.areas.length === this.MAX_AREAS) {
            this.showDrawer = false;
            this.destroyDrawer();
        }

        this.isLabelsListEmpty = false;
        this.isDirty = true;

        this.addLabel(area);
    }

    private deleteArea(id: string) {
        this.areas = this.areas.filter((area) => area.id !== id);
        this.areasView.areas = [...this.areas];
        this.removeLabel(id);
        this.isLabelsListEmpty = this.areas.length === 0;

        if (!this.showDrawer) {
            this.showDrawer = true;
        }
    }

    private getNewAreaName(): string {
        return `${this.isLineDrawMode ? 'Line' : 'Area'} ${this.labelListIndex++}`;
    }

    private getNextColor(): string {
        for (const color of Object.values(DrawingColors)) {
            const area = this.areas.filter((a) => a.color === color);
            if (!area.length) {
                return color;
            }
        }
        return '';
    }

    private addLabel(area: IArea) {
        const li = window.document.createElement('li');
        const layerLabel = <LayerLabelComponent>window.document.createElement('media-layer-label');
        li.id = area.id;
        layerLabel.config = this.getLabelConfig(area);
        li.appendChild(layerLabel);
        this.labelsList.appendChild(li);
        layerLabel.addEventListener('label-action', (e: any) => {
            console.log(e);
            switch (e.detail?.type) {
                case UIActionType.RENAME:
                    console.log('RENAME');
                    return;
                case UIActionType.DELETE:
                    console.log('DELETE');
                    this.deleteArea(e.detail.id);
                    return;
            }
        });
    }

    private removeLabel(id: string) {
        const li = this.shadowRoot.getElementById(id);
        this.labelsList.removeChild(li);
    }

    public getLabelConfig(area: IArea): ILayerLabelConfig {
        console.log(area);
        return {
            id: area.id,
            label: area.name,
            color: area.color,
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

    private getAreasOutputs(): IAreaOutput[] {
        const outputs: IAreaOutput[] = [];
        for (const area of this.areas) {
            const output: IAreaOutput = {
                '@type': '#Microsoft.VideoAnalyzer',
                name: area.name
            };

            if (area.points.length === 2) {
                output['@type'] += '.NamedLineString';
                output.line = area.points;
            } else {
                output['@type'] += '.NamedPolygonString';
                output.polygon = area.points;
            }

            outputs.push(output);
        }

        return outputs;
    }
}
