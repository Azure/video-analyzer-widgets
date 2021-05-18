import { attr, customElement, FASTElement } from '@microsoft/fast-element';
import { cloneDeep } from 'lodash-es';
import { EMPTY, fromEvent, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { IChartData, IChartOptions } from './svg-progress-chart/svg-progress.definitions';
import { SVGProgressChart } from './svg-progress-chart/svg-progress.class';
import { ISegmentsTimelineConfig, IUISegment, IUISegmentEventData, SegmentsTimelineEvents } from './segments-timeline.definitions';
import { styles } from './segments-timeline.style';
import { template } from './segments-timeline.template';
import { closestElement } from '../../../common/utils/elements';

/**
 * Segments Timeline Component
 * @public
 */
@customElement({
    name: 'media-segments-timeline',
    template,
    styles
})
export class SegmentsTimelineComponent extends FASTElement {
    /**
     * Segments Timeline configuration, includes data & display options
     *
     * @public
     * @remarks
     * HTML attribute: config
     */
    @attr public config: ISegmentsTimelineConfig = null;

    /**
     * current time, indicate the current line time
     *
     * @public
     * @remarks
     * HTML attribute: current time
     */
    @attr public currentTime: number = 0;

    private processedSegments: IChartData[] = [];
    private timelineProgress?: SVGProgressChart;
    private readonly DEFAULT_COLOR = 'black';
    private readonly TOOLTIP_TEXT = 'white';
    private readonly emptyConfig: ISegmentsTimelineConfig = {
        data: {
            segments: [] as IUISegment[],
            duration: 0
        },
        displayOptions: {
            height: 20
        }
    };
    private readonly DAY_DURATION_IN_SECONDS = 86400; // 60 (sec) * 60 (min) * 24 (hours)

    private resizeObserver: ResizeObserver;

    public constructor(config: ISegmentsTimelineConfig) {
        super();
        this.config = config || this.emptyConfig;
    }

    public configChanged() {
        if (this.config) {
            this.initSegmentsLine();
        }
    }

    public zoomChanged() {
        if (this.config) {
            this.initSegmentsLine();
        }
    }

    public currentTimeChanged() {
        this.timelineProgress?.setProgress(+this.currentTime);
    }

    public connectedCallback() {
        super.connectedCallback();
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

        this.resizeObserver?.disconnect();
    }

    public initSegmentsLine() {
        this.prepareData();
        setTimeout(() => {
            this.initSVGProgress();
        });
    }

    public prepareData(): void {
        this.processedSegments = [];

        if (!this.config?.data?.segments?.length) {
            return;
        }

        const designSystem = closestElement('ava-design-system-provider', this.$fastController.element);
        const segmentsDefaultColor = designSystem
            ? getComputedStyle(designSystem)?.getPropertyValue('--segments-color')
            : this.DEFAULT_COLOR;
        const segmentsTooltipText = designSystem
            ? getComputedStyle(designSystem)?.getPropertyValue('--segments-tooltip-text')
            : this.TOOLTIP_TEXT;

        const segments = cloneDeep(this.config.data.segments);
        for (let i = 0; i < segments.length; i++) {
            let left = Math.min((segments[i].startSeconds / this.config.data.duration) * 100, 100);
            let per = Math.max((segments[i].endSeconds - segments[i].startSeconds) / this.config.data.duration, 0.0051);

            // Merging following segments if the time difference is less them timeSmoothing
            if (this.config.displayOptions?.timeSmoothing && this.config.displayOptions?.timeSmoothing > 0 && i > 0) {
                const lastAppearance = segments[i - 1];
                if (
                    lastAppearance.endSeconds + this.config.displayOptions?.timeSmoothing > segments[i].startSeconds &&
                    lastAppearance.color === segments[i].color
                ) {
                    this.processedSegments.pop();
                    segments[i].startSeconds = lastAppearance.startSeconds;
                    left = Math.min((segments[i].startSeconds / this.config.data.duration) * 100, 100);
                    per = Math.max((segments[i].endSeconds - segments[i].startSeconds) / this.config.data.duration, 0.0051);
                }
            }

            this.processedSegments.push({
                x: left,
                width: per * 100,
                color: segments[i].color || segmentsDefaultColor,
                textColor: segments[i].textColor || segmentsTooltipText
            });
        }
    }

    public getFirstParentWidth(node: HTMLElement): number {
        let parentNode = <HTMLElement>node.parentNode;
        let width = parentNode ? node.getBoundingClientRect().width : 0;
        while (parentNode && !width) {
            parentNode = <HTMLElement>node.parentNode;
            if (!parentNode.getBoundingClientRect) {
                return 0;
            }
            width = parentNode.getBoundingClientRect().width;
        }

        return width;
    }

    public onTimeChange(): Observable<Event> {
        if (!window) {
            return EMPTY;
        }
        const source = fromEvent(window, 'message');
        return source.pipe(distinctUntilChanged());
    }

    public getNextSegment(returnStartTime = true): number {
        const time = this.currentTime || 0;

        if (!this.processedSegments?.length) {
            return 0;
        }

        // Go over segments
        for (let index = 0; index < this.config?.data?.segments.length; index++) {
            const segment = this.config?.data?.segments[index];
            // Find current segment
            if (segment?.startSeconds <= time && segment?.endSeconds >= time) {
                // If last segment, return 0, else return next one
                const segmentIndex = index === this.config?.data?.segments.length - 1 ? 0 : index + 1;
                const nextSegment = this.config?.data?.segments[segmentIndex];
                return returnStartTime ? nextSegment.startSeconds : nextSegment.endSeconds;
            }
        }

        this.timelineProgress.activeSegment = null;
        return 0;
    }

    public getPreviousSegment(returnStartTime = true): number {
        const time = this.currentTime || this.DAY_DURATION_IN_SECONDS;

        if (!this.processedSegments?.length) {
            return 0;
        }

        // Go over segments
        for (let index = this.config?.data?.segments.length - 1; index >= 0; index--) {
            const segment = this.config?.data?.segments[index];
            // Find current segment
            if (segment?.startSeconds <= time && segment?.endSeconds >= time) {
                // If first segment, return last, else return prev one
                const segmentIndex = index === 0 ? this.config?.data?.segments.length - 1 : index - 1;
                const nextSegment = this.config?.data?.segments[segmentIndex];
                return returnStartTime ? nextSegment.startSeconds : nextSegment.endSeconds;
            }
        }

        this.timelineProgress.activeSegment = null;
        return 0;
    }

    private initSVGProgress() {
        const container = this.$fastController.element.shadowRoot?.querySelector('svg');
        const containerWidth = this.$fastController.element.offsetWidth * (this.config.displayOptions.zoom || 1);
        container.style.width = `${containerWidth}px`;

        const chartOptions: IChartOptions = {
            width: containerWidth,
            height: this.config?.displayOptions?.height || 30,
            time: this.config?.data?.duration || 1,
            data: this.processedSegments,
            barHeight: this.config?.displayOptions?.barHeight || 12,
            renderTooltip: this.config?.displayOptions?.renderTooltip || false,
            tooltipHeight: this.config?.displayOptions?.tooltipHeight,
            renderProgress: this.config?.displayOptions?.renderProgress || false,
            renderSeek: this.config?.displayOptions?.renderSeek || null,
            top: this.config?.displayOptions?.top,
            disableCursor: this.config?.displayOptions?.disableCursor || false
        };

        this.timelineProgress?.destroy();
        this.timelineProgress = new SVGProgressChart(<SVGElement>container, chartOptions);

        // Set initial progress
        this.timelineProgress.setProgress(this.currentTime);

        this.timelineProgress.onSetProgress((time: number) => {
            this.currentTime = time;
            this.$emit(SegmentsTimelineEvents.CURRENT_TIME_CHANGE, this.currentTime);
        });

        this.timelineProgress.activeSegmentCallback = (segmentEvent: IUISegmentEventData) => {
            this.$emit(SegmentsTimelineEvents.SEGMENT_CLICKED, segmentEvent);
        };

        this.timelineProgress.segmentStartCallback = (segmentEvent: IUISegmentEventData) => {
            this.$emit(SegmentsTimelineEvents.SEGMENT_START, segmentEvent);
        };

        // Subscribe to on time change -
        this.onTimeChange().subscribe((e: Event) => {
            // If event has progress data
            const event = e as MessageEvent;

            if (event.data) {
                // Get the time from the event
                const time = event.data.time || event.data.currentTime;

                if (!time) {
                    return;
                }
                setTimeout(() => {
                    this.currentTime = time;
                });
            }
        });
    }

    private resize() {
        this.timelineProgress?.destroy();
        this.initSVGProgress();
    }
}
