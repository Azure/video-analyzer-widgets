import { customElement, attr, FASTElement, observable } from '@microsoft/fast-element';
// import { AreasViewComponent } from '../../../..';
// import { LineDrawerComponent } from '../../../..';
import { IPoint } from '../../../common/drawer-canvas/drawer-canvas.definitions';
import { guid } from '../../../common/utils/guid';
import { DELETE_SVG_PATH, RENAME_SVG_PATH } from '../../../styles/svg/svg-shapes';
import { DrawingColors } from '../../../styles/system-providers/ava-design-system-provider.definitions';
import { UIActionType } from '../../../web-components/src/actions-menu/actions-menu.definitions';
import { AreasViewComponent } from '../../../web-components/src/areas-view/areas-view.component';
import { LayerLabelComponent } from '../../../web-components/src/layer-label/layer-label.component';
import { ILayerLabelConfig, LayerLabelMode } from '../../../web-components/src/layer-label/layer-label.definitions';
import { LineDrawerComponent } from '../../../web-components/src/line-drawer/line-drawer.component';
// import { IArea } from '../../../web-components/src/areas-view/areas-view.definitions';
import { AreaDrawMode, ColorsRanking, IArea, IAreaDrawWidgetConfig } from './area-draw.definitions';
import { styles } from './area-draw.style';
import { template } from './area-draw.template';

@customElement({
    name: 'area-draw-widget',
    template,
    styles
})
export class AreaDrawWidget extends FASTElement {
    @attr public config: IAreaDrawWidgetConfig;
    public configChanged() {
        setTimeout(() => {
            if (this.isReady) {
                this.initAreaDrawComponents();
            }
        });
    }

    @observable public areas: IArea[] = [];
    public areasColorsMap: Map<ColorsRanking, IArea>[] = [];

    @observable public isReady = false;
    public areaDrawMode = AreaDrawMode.Line;
    @observable public isDirty = false;

    //  public areasCanvas: AreasCanvas;
    private readonly CANVAS_DEFAULT_HEIGHT = 375;
    private readonly CANVAS_DEFAULT_WIDTH = 250;
    private readonly CANVAS_POSITION = 'relative';
    private readonly LINE_WIDTH = 2;
    private readonly MAX_AREAS = 10;

    private areasView: AreasViewComponent;
    private lineDrawer: LineDrawerComponent;
    private labelsList: HTMLElement;
    private labelListIndex = 1;

    //  private areasOptions: IAreasOptions;

    public constructor() {
        super();
    }
    //  public areasChanged() {
    //      setTimeout(() => {
    //          this.initAreasOptions();
    //          this.areasCanvas.areasOptions = this.areasOptions;
    //          this.areasCanvas.resize();
    //      });
    //  }

    @observable showDrawer = true;
    @observable isLineDrawMode = true;
    @observable isLabelsListEmpty = true;

    // Only after creation of the template, the canvas element is created and assigned to DOM
    public connectedCallback() {
        super.connectedCallback();

        // this.areas = [...(this.config?.areas || [])];
        this.isReady = true;
        this.initAreaDrawComponents();
        window.addEventListener('resize', () => {
            const rvxContainer = this.shadowRoot.querySelector('.rvx-widget-container');
            this.labelsList.style.maxHeight = `${rvxContainer.clientHeight}px`;
        });
    }

    private initAreaDrawComponents() {
        this.labelsList = this.shadowRoot.querySelector('.labels-list');
        this.initAreas();
        // this.setLabels();
        this.initDrawer();
    }

    public close() {
        console.log('close');
    }
    public save() {
        console.log('save');
    }
    public done() {
        console.log('done');
    }

    private initDrawer() {
        if (this.isLineDrawMode) {
            this.lineDrawer = this.shadowRoot.querySelector('media-line-drawer');

            if (!this.lineDrawer) {
                return;
            }
            this.lineDrawer.borderColor = this.getNextColor();

            this.lineDrawer.addEventListener('drawerComplete', (e: any) => {
                console.log(e.detail);
                this.createArea(e.detail);
            });
        } else {
            // init polygon drawer
        }
    }

    public toggleDrawMode() {
        this.isLineDrawMode = !this.isLineDrawMode;
    }

    private initAreas() {
        // this.areas = [...(this.config?.areas || [])];
        // this.isLabelsListEmpty = this.areas.length === 0;

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
            setTimeout(() => {
                this.initDrawer();
            });
        }

        // this.setLabels();
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

    private setLabels() {
        this.labelsList = this.shadowRoot.querySelector('.labels-list');
    }

    private addLabel(area: IArea) {
        // const id = guid();
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
            label: area.name || this.generateName(area),
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

    private generateName(area: IArea): string {
        return `${this.isLineDrawMode ? 'Line' : 'Area'} ${this.areas.indexOf(area) + 1}`;
    }

    // public isLineDrawMode(): boolean {
    //     return this.areaDrawMode === AreaDrawMode.Line;
    // }
}
