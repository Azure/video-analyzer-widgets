import { attr, customElement, FASTElement, observable } from '@microsoft/fast-element';
import { EMPTY, fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { IChartData, IChartOptions } from './svg-progress-chart/src/interfaces';
import { SVGProgressChart } from './svg-progress-chart/src/svgProgress';
import { ITimeLineConfig, IUIAppearance } from './time-line-component.definitions';
import { styles } from './time-line-component.style';
import { template } from './time-line-component.template';

/**
 * An example web component item.
 * @public
 */
@customElement({
    name: 'time-line-component',
    template,
    styles
})
export class TimeLineComponent extends FASTElement {
    /**
     * Time Line configuration, includes data & display options
     *
     * @public
     * @remarks
     * HTML attribute: config
     */
    @attr public config: ITimeLineConfig = {
        data: {
            appearances: [],
            duration: 0
        },
        displayOptions: {
            height: 0
        }
    };

    private currentTime: number = 0;
    private processedAppearances: IChartData[] = [];
    private timelineProgress?: SVGProgressChart;

    public constructor(config: ITimeLineConfig) {
        super();
        this.config = config;
    }

    public configChanged() {
        if (!this.config?.data?.appearances?.length) {
            return;
        }
        setTimeout(() => {
            this.initTimeLine();
        });
    }

    public connectedCallback() {
        super.connectedCallback();
        this.onResizeEventStream()?.subscribe(() => {
            this.timelineProgress?.destroy();
            this.initSVGProgress();
        });
    }

    public initTimeLine() {
        this.prepareData();
        this.initSVGProgress();
    }

    public prepareData(): void {
        this.processedAppearances = [];

        if (!this.config.data.appearances.length) {
            return;
        }
        this.config.data.appearances.forEach((a: IUIAppearance) => {
            const left = Math.min((a.startSeconds / this.config.data.duration) * 100, 100);
            const per = Math.max((a.endSeconds - a.startSeconds) / this.config.data.duration, 0.0051);

            this.processedAppearances.push({
                x: left,
                width: per * 100,
                className: (a.className && a.className.toLowerCase()) || 'default'
            });
        });
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

    public onResizeEventStream(minimum = 375, debounce = 600) {
        if (!window) {
            return null;
        }
        const source = fromEvent(window, 'resize');
        return (
            source
                /* eslint-disable  @typescript-eslint/no-explicit-any */
                .pipe(map((val: any) => val.target['innerWidth']))
                .pipe(filter((val) => val > minimum))
                .pipe(debounceTime(debounce))
                .pipe(distinctUntilChanged())
        );
    }

    private initSVGProgress() {
        const container = this.$fastController.element.shadowRoot?.querySelector('svg');
        let containerWidth = container?.getBoundingClientRect().width;

        // If container width is zero (show = false) - take width from parent
        if (!containerWidth) {
            // Timeline is not shown
            containerWidth = this.getFirstParentWidth(<HTMLElement>this.$fastController.element.shadowRoot?.getRootNode());
        }
        const chartOptions: IChartOptions = {
            width: containerWidth,
            height: this.config.displayOptions.height,
            time: this.config.data.duration,
            data: this.processedAppearances,
            barHeight: this.config.displayOptions.barHeight,
            renderTooltip: this.config.displayOptions.renderTooltip,
            tooltipHeight: this.config.displayOptions.tooltipHeight,
            renderProgress: this.config.displayOptions.renderProgress,
            top: this.config.displayOptions.top
        };

        this.timelineProgress = new SVGProgressChart(<SVGElement>container, chartOptions);

        // Set initial progress
        this.timelineProgress.setProgress(this.currentTime);

        this.timelineProgress.onSetProgress((time: number) => {
            this.currentTime = time;
            this.$emit('current-time', this.currentTime);
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
                    this.timelineProgress?.setProgress(time);
                });
            }
        });
    }
}
