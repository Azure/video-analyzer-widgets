import { attr, customElement, FASTElement } from '@microsoft/fast-element';
import { EMPTY, fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { cloneDeep } from 'lodash-es';
import { IChartData, IChartOptions } from './svg-progress-chart/src/interfaces';
import { SVGProgressChart } from './svg-progress-chart/src/svgProgress';
import { IAppearancesLineConfig } from './appearances-line-component.definitions';
import { styles } from './appearances-line-component.style';
import { template } from './appearances-line-component.template';

/**
 * An example web component item.
 * @public
 */
@customElement({
    name: 'appearances-line-component',
    template,
    styles
})
export class AppearancesLineComponent extends FASTElement {
    /**
     * Time Line configuration, includes data & display options
     *
     * @public
     * @remarks
     * HTML attribute: config
     */
    @attr public config: IAppearancesLineConfig = {
        data: {
            appearances: [],
            duration: 0
        },
        displayOptions: {
            height: 0
        }
    };

    /**
     * current time, indicate the current line time
     *
     * @public
     * @remarks
     * HTML attribute: current time
     */
    @attr public currentTime: number = 0;

    private processedAppearances: IChartData[] = [];
    private timelineProgress?: SVGProgressChart;

    public constructor(config: IAppearancesLineConfig) {
        super();
        this.config = config;
    }

    public configChanged() {
        if (!this.config?.data?.appearances?.length) {
            return;
        }
        setTimeout(() => {
            this.initAppearancesLine();
        });
    }

    public connectedCallback() {
        super.connectedCallback();
        // this.addEventListener('change', (e) => console.log((<HTMLElement>e.target).tagName));
        this.onResizeEventStream()?.subscribe(() => {
            this.timelineProgress?.destroy();
            this.initSVGProgress();
        });
    }

    public initAppearancesLine() {
        this.prepareData();
        this.initSVGProgress();
    }

    public prepareData(): void {
        this.processedAppearances = [];

        if (!this.config.data.appearances.length) {
            return;
        }

        const designSystem = window.document.getElementsByTagName('ava-design-system-provider')[0];
        const appearancesDefaultColor = designSystem ? getComputedStyle(designSystem)?.getPropertyValue('--appearances-color') : 'black';
        const appearancesTooltipText = designSystem
            ? getComputedStyle(designSystem)?.getPropertyValue('--appearances-tooltip-text')
            : 'white';

        const appearances = cloneDeep(this.config.data.appearances);
        for (let i = 0; i < appearances.length; i++) {
            let left = Math.min((appearances[i].startSeconds / this.config.data.duration) * 100, 100);
            let per = Math.max((appearances[i].endSeconds - appearances[i].startSeconds) / this.config.data.duration, 0.0051);

            if (this.config.timeSmoothing && this.config.timeSmoothing > 0 && i > 0) {
                const lastAppearance = appearances[i - 1];
                if (
                    lastAppearance.endSeconds + this.config.timeSmoothing > appearances[i].startSeconds &&
                    lastAppearance.color === appearances[i].color
                ) {
                    this.processedAppearances.pop();
                    appearances[i].startSeconds = lastAppearance.startSeconds;
                    left = Math.min((appearances[i].startSeconds / this.config.data.duration) * 100, 100);
                    per = Math.max((appearances[i].endSeconds - appearances[i].startSeconds) / this.config.data.duration, 0.0051);
                }
            }

            this.processedAppearances.push({
                x: left,
                width: per * 100,
                color: appearances[i].color || appearancesDefaultColor,
                textColor: appearances[i].textColor || appearancesTooltipText
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

    public onResizeEventStream(minimum = 375, debounce = 600) {
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
