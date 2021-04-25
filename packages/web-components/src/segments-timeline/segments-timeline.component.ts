import { attr, customElement, FASTElement } from '@microsoft/fast-element';
import { EMPTY, fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { cloneDeep } from 'lodash-es';
import { IChartData, IChartOptions } from './svg-progress-chart/svg-progress.definitions';
import { SVGProgressChart } from './svg-progress-chart/svg-progress.class';
import { ISegmentsTimelineConfig, IUISegment, SegmentsTimelineEvents } from './segments-timeline.definitions';
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
    private lastActiveSegment: IUISegment;

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
        this.onResizeEventStream()?.subscribe(() => {
            this.timelineProgress?.destroy();
            this.initSVGProgress();
        });
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

    public onResizeEventStream(minimum = 375, debounce = 100) {
        if (!window) {
            return null;
        }
        const source = fromEvent(window, 'resize');
        return (
            source
                /* eslint-disable  @typescript-eslint/no-explicit-any */
                .pipe(map((val: any) => val.target['innerWidth']))
                .pipe(filter((val: any) => val > minimum))
                .pipe(debounceTime(debounce))
                .pipe(distinctUntilChanged())
        );
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
            top: this.config?.displayOptions?.top
        };

        this.timelineProgress?.activeSegment$?.unsubscribe();
        this.timelineProgress?.destroy();
        this.timelineProgress = new SVGProgressChart(<SVGElement>container, chartOptions);

        // Set initial progress
        this.timelineProgress.setProgress(this.currentTime);

        this.timelineProgress.onSetProgress((time: number) => {
            this.currentTime = time;
            this.$emit(SegmentsTimelineEvents.CurrentTimeChanged, this.currentTime);
        });

        this.timelineProgress.activeSegment$.subscribe((activeSegment) => {
            if (
                activeSegment &&
                activeSegment?.startSeconds !== this.lastActiveSegment?.startSeconds &&
                activeSegment?.endSeconds !== this.lastActiveSegment?.endSeconds
            ) {
                this.lastActiveSegment = activeSegment;
                this.$emit(SegmentsTimelineEvents.SegmentClicked, activeSegment);
            }
        });

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
}
