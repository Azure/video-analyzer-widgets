import { FASTSlider } from '@microsoft/fast-components';
import { attr, FASTElement, customElement } from '@microsoft/fast-element';
import { template } from './metadata-timelines.template';
import { styles } from './metadata-timelines.style';
import { ISegmentsTimelineConfig, IUISegmentEventData, SegmentsTimelineEvents } from '../segments-timeline/segments-timeline.definitions';
import { IMetadataTimelinesConfig } from './metadata-timelines.definitions';
import { SegmentsTimelineComponent } from '../segments-timeline/segments-timeline.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { Logger } from '../../../widgets/src/common/logger';
import { closestElement } from '../../../common/utils/elements';
import SimpleBar from 'simplebar';
import { getKeyCode, keyCodeEnter, keyCodeSpace } from '@microsoft/fast-web-utilities';
import { TimelineEvents } from '../timeline/timeline.definitions';
import { TimeRulerComponent } from '../time-ruler';

TimelineComponent;
SegmentsTimelineComponent;
TimeRulerComponent;

/**
 * Metadata timelines component.
 * @public
 */
@customElement({
    name: 'metadata-timelines',
    template,
    styles
})
export class MetadataTimelines extends FASTElement {
    @attr public config: IMetadataTimelinesConfig;

    @attr public currentTime: number = 0;

    private segmentsTimelines: SegmentsTimelineComponent[];

    private segmentsTimelineReady = false;

    public zoom: number = 1;
    public scrollContainer: Element;
    private fastSlider: FASTSlider;
    private timeRuler: TimeRulerComponent;
    private timeRulerReady = false;
    private simpleBar: any;

    private readonly SLIDER_DENSITY = 32;
    private readonly SLIDER_MAX_ZOOM = 22;
    private readonly SEEK_BAR_TOP = '#FAF9F8';
    private readonly SEEK_BAR_BODY_COLOR = '#D02E00';
    private readonly CANVAS_MAX_WIDTH = 32767;

    public constructor(private callback: () => void = null) {
        super();
    }

    public configChanged() {
        setTimeout(() => {
            if (this.segmentsTimelineReady && this.segmentsTimelines.length != this.config.data.length) {
                this.segmentsTimelineReady = false;
            }
            this.initTimeline();
        });
    }

    public currentTimeChanged() {
        if (this.segmentsTimelineReady) {
            for (let i = 0; i < this.segmentsTimelines.length; i++) {
                this.segmentsTimelines[i].currentTime = this.currentTime;
            }
        }
    }

    public connectedCallback() {
        super.connectedCallback();
        this.scrollContainer = this.shadowRoot.querySelector('.metadata-scroll-container');
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
    }

    public initTimeline() {
        if (!this.segmentsTimelineReady || !this.timeRulerReady) {
            return;
        }
        this.initSegmentsTimelines();
        this.initTimeRuler();
        if (!this.config?.disableZoom) {
            setTimeout(() => {
                this.initSlider();
                this.simpleBar?.recalculate();
            }, 50);
        }
    }

    private initSegmentsTimelines() {
        const designSystem = closestElement('ava-design-system-provider', this.$fastController.element);
        const seekBarTopColor = designSystem ? getComputedStyle(designSystem)?.getPropertyValue('--type-highlight') : this.SEEK_BAR_TOP;
        const seekBarBodyColor = designSystem
            ? getComputedStyle(designSystem)?.getPropertyValue('--play-indicator')
            : this.SEEK_BAR_BODY_COLOR;
        for (let i = 0; i < this.segmentsTimelines.length; i++) {
            const timeline = this.segmentsTimelines[i];
            const config: ISegmentsTimelineConfig = {
                data: {
                    segments: this.config.data[i].segments,
                    duration: this.config.duration,
                },
                displayOptions: {
                    height: 30,
                    barHeight: 12,
                    top: 5,
                    renderTooltip: false,
                    renderProgress: false,
                    renderSeek: {
                        seekBarBodyColor: seekBarBodyColor,
                        seekBarTopColor: seekBarTopColor
                    },
                    zoom: this.zoom,
                    disableCursor: true
                }
            }
            timeline.config = config;
        }
    }

    private initTimeRuler() {
        this.timeRuler.startDate = this.config?.date || new Date();
        this.timeRuler.zoom = this.zoom;
    }

    public segmentsTimelineConnectedCallback() {
        setTimeout(() => {
            this.segmentsTimelines = [];
            let timelines = this.shadowRoot?.querySelectorAll<SegmentsTimelineComponent>('media-segments-timeline');
            for (let i = 0; i < timelines.length; i++) {
                this.segmentsTimelines.push(timelines[i]);
            }
            if (this.segmentsTimelines.length == this.config.data.length) {
                this.segmentsTimelineReady = true;
                for (let i = 0; i < this.segmentsTimelines.length; i++) {
                    this.segmentsTimelines[i].addEventListener(SegmentsTimelineEvents.SEGMENT_CLICKED, ((event: CustomEvent<IUISegmentEventData>) => {
                        this.$emit(TimelineEvents.CURRENT_TIME_CHANGE, event.detail);
                        Logger.log('current time changed from metadata');
                        Logger.log(event.detail);
                    }) as EventListener);
                }
                this.initTimeline();
            }
        });
    }

    public fastSliderConnectedCallback() {
        setTimeout(() => {
            this.fastSlider = this.shadowRoot?.querySelector('.metadata-fast-slider');
            this.fastSlider?.addEventListener('change', this.fastSliderChange.bind(this));
            setTimeout(() => {
                this.initSimpleBar();
                this.initSlider();
            }, 50);
        });
    }

    private initSlider() {
        if (!this.fastSlider) {
            return;
        }

        this.fastSlider.min = this.SLIDER_DENSITY;
        this.fastSlider.max = this.SLIDER_MAX_ZOOM * this.SLIDER_DENSITY;
        this.fastSlider.value = `${this.zoom / 2 * this.SLIDER_DENSITY}`;
    }

    public initSimpleBar() {
        if (this.simpleBar || this.config?.disableZoom) {
            return;
        }

        this.simpleBar = new SimpleBar(this.scrollContainer as HTMLElement, {
            autoHide: false,
            forceVisible: 'x',
            classNames: {},
            scrollbarMinSize: 100
        });
        this.simpleBar.recalculate();
    }

    public handleZoomInMouseUp(e: Event): boolean {
        switch (getKeyCode(e as KeyboardEvent)) {
            case 1: // left mouse button.
                this.zoomIn();
                return false;
        }

        return true;
    }

    public handleZoomInKeyUp(e: KeyboardEvent): boolean {
        switch (getKeyCode(e)) {
            case keyCodeEnter:
            case keyCodeSpace:
                this.zoomIn();
                return false;
        }

        return true;
    }

    public handleZoomOutMouseUp(e: Event): boolean {
        switch (getKeyCode(e as KeyboardEvent)) {
            case 1: // left mouse button.
                this.zoomOut();
                return false;
        }

        return true;
    }

    public handleZoomOutKeyUp(e: KeyboardEvent): boolean {
        switch (getKeyCode(e)) {
            case keyCodeEnter:
            case keyCodeSpace:
                this.zoomOut();
                return false;
        }

        return true;
    }

    private zoomIn() {
        if (+this.fastSlider.value + this.SLIDER_DENSITY <= this.SLIDER_MAX_ZOOM * this.SLIDER_DENSITY) {
            this.fastSlider.value = `${+this.fastSlider.value + this.SLIDER_DENSITY}`;
        } else {
            this.fastSlider.value = `${+this.SLIDER_MAX_ZOOM * this.SLIDER_DENSITY}`;
        }
    }

    private zoomOut() {
        if (+this.fastSlider.value - this.SLIDER_DENSITY >= this.SLIDER_DENSITY) {
            this.fastSlider.value = `${+this.fastSlider.value - this.SLIDER_DENSITY}`;
        } else {
            this.fastSlider.value = `${this.SLIDER_DENSITY}`;
        }
    }

    private fastSliderChange() {
        const zoom = +this.fastSlider.value / this.SLIDER_DENSITY;
        Logger.log('metadata slider value ' + zoom);
        // Do not zoom when canvas is more then 32,767 (max canvas width)
        if (zoom * this.$fastController.element.offsetWidth >= this.CANVAS_MAX_WIDTH) {
            return;
        }
        this.zoom = zoom * 2;
        this.initTimeline();
        setTimeout(() => {
            this.simpleBar?.recalculate();
        });
    }

    public timeRulerConnectedCallback() {
        setTimeout(() => {
            this.timeRuler = <TimeRulerComponent>this.shadowRoot?.querySelector('media-time-ruler');
            this.timeRulerReady = true;
            this.initTimeline();
        });
    }
}