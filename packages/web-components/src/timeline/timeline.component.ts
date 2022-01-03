/* eslint-disable @typescript-eslint/no-unused-expressions */
import { FASTSlider } from '@microsoft/fast-components';
import { attr, customElement, FASTElement } from '@microsoft/fast-element';
import { getKeyCode, keyCodeEnter, keyCodeSpace } from '@microsoft/fast-web-utilities';
import SimpleBar from 'simplebar';
import { closestElement } from '../../../common/utils/elements';
import { guid } from '../../../common/utils/guid';
import { IBarElement, ISeekBarElement } from '../player-component/UI/definitions';
import { SegmentsTimelineComponent } from '../segments-timeline';
import { ISegmentsTimelineConfig, IUISegmentEventData, SegmentsTimelineEvents } from '../segments-timeline/segments-timeline.definitions';
import { TimeRulerComponent } from '../time-ruler';
import { ITimeLineConfig, TimelineEvents } from './timeline.definitions';
import { styles } from './timeline.style';
import { template } from './timeline.template';
import { Localization } from './../../../common/services/localization/localization.class';
import { IDictionary } from '../../../common/services/localization/localization.definitions';
import { observable } from '@microsoft/fast-element';

SimpleBar;
SegmentsTimelineComponent;
TimeRulerComponent;
Localization;

/**
 * Time Line component.
 * @public
 */
@customElement({
    name: 'media-timeline',
    template,
    styles
})
export class TimelineComponent extends FASTElement {
    @attr public id: string = guid();

    /**
     * The config of the time line.
     *
     * @public
     * @remarks
     * HTML attribute: config
     */
    @attr public config: ITimeLineConfig;

    /**
     * current time, indicate the current line time
     *
     * @public
     * @remarks
     * HTML attribute: current time
     */
    @attr public currentTime: number = 0;

    @observable public resources: IDictionary = {};

    public readonly DAY_DURATION_IN_SECONDS = 86400; // 60 (sec) * 60 (min) * 24 (hours)
    public readonly DEFAULT_ZOOM_LEVEL = 9;

    public zoom: number = this.DEFAULT_ZOOM_LEVEL;
    public zoomFactor: number = 1;
    public scrollContainer: Element;
    public autoScrolled = false;

    private timeRulerReady = false;
    private segmentsTimelineReady = false;
    private segmentsTimeline: SegmentsTimelineComponent;
    private timeRuler: TimeRulerComponent;
    private fastSlider: FASTSlider;
    private slider_max_zoom = 13;
    private userScrolled = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private simpleBar: any;
    private resizeObserver: ResizeObserver;

    private readonly SLIDER_DENSITY = 32;
    private readonly SEEK_BAR_TOP = '#FAF9F8';
    private readonly SEEK_BAR_BODY_COLOR = '#D02E00';
    private readonly CANVAS_MAX_WIDTH = 32767;

    public constructor(private callback: () => void = null) {
        super();
    }

    public configChanged() {
        setTimeout(() => {
            this.initTimeLine();
        });
    }

    public currentTimeChanged() {
        if (this.segmentsTimeline) {
            this.segmentsTimeline.currentTime = this.currentTime;
        }
        if (!this.userScrolled) {
            this.scrollToCurrentTime();
        }
    }

    public connectedCallback() {
        super.connectedCallback();

        if (!Object.keys(this.resources).length) {
            this.resources = Localization.dictionary;
        }

        const parent = this.$fastController?.element?.parentElement;
        this.resizeObserver = new ResizeObserver(this.resize.bind(this));
        this.resizeObserver.observe(parent || this.$fastController?.element);

        this.scrollContainer = this.shadowRoot.querySelector('.scroll-container');
    }

    public disconnectedCallback() {
        super.disconnectedCallback();

        this.resizeObserver?.disconnect();
        this.fastSlider?.removeEventListener('change', this.fastSliderChange);
        this.segmentsTimeline?.removeEventListener(SegmentsTimelineEvents.SEGMENT_CLICKED, null);
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

        this.simpleBar.getScrollElement().addEventListener('scroll', () => {
            if (this.autoScrolled) {
                this.autoScrolled = false;
            } else {
                this.userScrolled = true;
            }
        });
        this.simpleBar.recalculate();
    }

    public getNextSegmentTime(returnStartTime = true): number {
        return this.segmentsTimeline?.getNextSegment(returnStartTime);
    }

    public getPreviousSegmentTime(returnStartTime = true): number {
        return this.segmentsTimeline?.getPreviousSegment(returnStartTime);
    }

    public segmentsTimelineConnectedCallback() {
        setTimeout(() => {
            this.segmentsTimeline = <SegmentsTimelineComponent>this.shadowRoot?.querySelector('media-segments-timeline');

            this.segmentsTimeline?.addEventListener(SegmentsTimelineEvents.SEGMENT_CLICKED, ((event: CustomEvent<IUISegmentEventData>) => {
                this.$emit(TimelineEvents.SEGMENT_CHANGE, event.detail);
                this.userScrolled = false;
                // eslint-disable-next-line no-undef
            }) as EventListener);

            this.segmentsTimeline?.addEventListener(SegmentsTimelineEvents.SEGMENT_START, ((event: CustomEvent<IUISegmentEventData>) => {
                this.$emit(TimelineEvents.SEGMENT_START, event.detail);
                // eslint-disable-next-line no-undef
            }) as EventListener);

            this.segmentsTimelineReady = true;

            if (this.callback) {
                this.callback();
            }
            this.initTimeLine();
        });
    }

    public timeRulerConnectedCallback() {
        setTimeout(() => {
            this.timeRuler = <TimeRulerComponent>this.shadowRoot?.querySelector('media-time-ruler');
            this.timeRulerReady = true;
            this.initTimeLine();
        });
    }

    public fastSliderConnectedCallback() {
        setTimeout(() => {
            this.fastSlider = this.shadowRoot?.querySelector('fast-slider');
            this.fastSlider?.addEventListener('change', this.fastSliderChange.bind(this));
            setTimeout(() => {
                this.initSimpleBar();
                this.initSlider();
            }, 50);
        });
    }

    public handleZoomInMouseUp(e: Event): boolean {
        switch (getKeyCode(e as KeyboardEvent)) {
            case 1: // left mouse button.
                this.userScrolled = false;
                this.zoomIn();
                return false;
        }

        return true;
    }

    public handleZoomInKeyUp(e: KeyboardEvent): boolean {
        switch (getKeyCode(e)) {
            case keyCodeEnter:
            case keyCodeSpace:
                this.userScrolled = false;
                this.zoomIn();
                return false;
        }

        return true;
    }

    public handleZoomResetMouseUp(e: Event): boolean {
        switch (getKeyCode(e as KeyboardEvent)) {
            case 1: // left mouse button.
                this.zoomReset();
                return false;
        }

        return true;
    }

    public handleZoomResetKeyUp(e: KeyboardEvent): boolean {
        switch (getKeyCode(e)) {
            case keyCodeEnter:
            case keyCodeSpace:
                this.zoomReset();
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

    public get seekBarElement(): ISeekBarElement {
        const barElement: IBarElement = this.segmentsTimeline?.bar;
        barElement.min = '0';
        barElement.max = `${this.DAY_DURATION_IN_SECONDS}`;
        return {
            bar: barElement,
            container: this.scrollContainer
        };
    }

    public scrollToCurrentTime() {
        if (this.simpleBar) {
            const scrollElement = this.simpleBar.getScrollElement();
            const currentTimeBarPercentage = Math.min((this.currentTime / this.DAY_DURATION_IN_SECONDS) * 100, 100);
            const clientWidthHalf = this.simpleBar.el.clientWidth / 2;
            let scrollLeftPoint = Math.floor((scrollElement.scrollWidth * currentTimeBarPercentage) / 100) - clientWidthHalf;
            if (scrollLeftPoint < 0) {
                scrollLeftPoint = 0;
            } else if (scrollLeftPoint > scrollElement.scrollWidth - this.simpleBar.el.clientWidth) {
                scrollLeftPoint = scrollElement.scrollWidth - this.simpleBar.el.clientWidth;
            }
            if (scrollLeftPoint !== scrollElement.scrollLeft) {
                scrollElement.scrollTo(scrollLeftPoint, 0);
            }
            this.autoScrolled = true;
        }
    }

    private zoomIn() {
        if (+this.fastSlider.value + this.SLIDER_DENSITY <= this.slider_max_zoom * this.SLIDER_DENSITY) {
            this.fastSlider.value = `${+this.fastSlider.value + this.SLIDER_DENSITY}`;
        } else {
            this.fastSlider.value = `${+this.slider_max_zoom * this.SLIDER_DENSITY}`;
        }
    }

    private zoomOut() {
        if (+this.fastSlider.value - this.SLIDER_DENSITY >= this.SLIDER_DENSITY) {
            this.fastSlider.value = `${+this.fastSlider.value - this.SLIDER_DENSITY}`;
        } else {
            this.fastSlider.value = `${this.SLIDER_DENSITY}`;
        }
    }

    private zoomReset() {
        this.zoom = this.DEFAULT_ZOOM_LEVEL;
        this.fastSlider.value = `${this.zoom * this.SLIDER_DENSITY}`;
        this.userScrolled = false;
    }

    private initTimeLine() {
        if (!this.timeRulerReady || !this.segmentsTimelineReady) {
            return;
        }

        this.initSegmentsTimeline();
        this.initTimeRuler();

        if (!this.config?.disableZoom) {
            setTimeout(() => {
                this.initSlider();
                this.simpleBar?.recalculate();
            }, 50);
        }
    }

    private initSlider() {
        if (!this.fastSlider) {
            return;
        }

        this.slider_max_zoom = Math.ceil(Math.log2(this.CANVAS_MAX_WIDTH / this.$fastController.element.offsetWidth) * 2);

        this.fastSlider.min = this.SLIDER_DENSITY;
        this.fastSlider.max = this.slider_max_zoom * this.SLIDER_DENSITY;
        this.fastSlider.value = `${this.zoom * this.SLIDER_DENSITY}`;
    }

    private initSegmentsTimeline() {
        const designSystem = closestElement('ava-design-system-provider', this.$fastController.element);
        const seekBarTopColor = designSystem ? getComputedStyle(designSystem)?.getPropertyValue('--type-highlight') : this.SEEK_BAR_TOP;
        const seekBarBodyColor = designSystem
            ? getComputedStyle(designSystem)?.getPropertyValue('--play-indicator')
            : this.SEEK_BAR_BODY_COLOR;
        const config: ISegmentsTimelineConfig = {
            data: {
                segments: this.config?.segments,
                duration: this.DAY_DURATION_IN_SECONDS
            },
            displayOptions: {
                height: 30,
                barHeight: 12,
                top: 5,
                renderTooltip: false,
                renderProgress: false,
                renderSeek: {
                    seekBarTopColor: seekBarTopColor,
                    seekBarBodyColor: seekBarBodyColor
                },
                zoom: this.zoom,
                zoomFactor: this.zoomFactor,
                disableCursor: true
            }
        };

        this.segmentsTimeline.config = config;
    }

    private initTimeRuler() {
        this.timeRuler.startDate = this.config?.date || new Date();
        this.timeRuler.zoom = this.zoom;
        this.timeRuler.zoomFactor = this.zoomFactor;
    }

    private resize() {
        this.initTimeLine();
    }

    private fastSliderChange() {
        const zoom = +this.fastSlider.value / this.SLIDER_DENSITY;
        const zoomFactor = Math.pow(2, Math.floor(zoom / 2)) / ((zoom - 1) % 2 ? 1.5 : 1);
        // Do not zoom when canvas is more then 32,767 (max canvas width)
        if (zoomFactor * this.$fastController.element.offsetWidth >= this.CANVAS_MAX_WIDTH) {
            return;
        }
        this.zoom = zoom;
        this.zoomFactor = (zoomFactor >= 1) ? zoomFactor : 1;

        this.initSegmentsTimeline();
        this.initTimeRuler();
        setTimeout(() => {
            this.simpleBar?.recalculate();
            this.scrollToCurrentTime();
        });
    }
}
