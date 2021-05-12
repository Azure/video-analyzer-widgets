import { FASTSlider } from '@microsoft/fast-components';
import { attr, customElement, FASTElement } from '@microsoft/fast-element';
import { SegmentsTimelineComponent } from '..';
import { closestElement } from '../../../common/utils/elements';
import { guid } from '../../../common/utils/guid';
import { ISegmentsTimelineConfig, IUISegmentEventData, SegmentsTimelineEvents } from '../segments-timeline/segments-timeline.definitions';
import { TimeRulerComponent } from '../time-ruler';
import { ITimeLineConfig, TimelineEvents } from './timeline.definitions';
import { styles } from './timeline.style';
import { template } from './timeline.template';

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

    public readonly DAY_DURATION_IN_SECONDS = 86400; // 60 (sec) * 60 (min) * 24 (hours)

    public zoom: number = 1;

    private segmentsTimeline: SegmentsTimelineComponent;
    private timeRuler: TimeRulerComponent;
    private fastSlider: FASTSlider;

    private readonly SLIDER_DENSITY = 32;
    private readonly SLIDER_MAX_ZOOM = 22;

    private readonly SEEK_BAR_TOP = '#FAF9F8';

    private readonly SEEK_BAR_BODY_COLOR = '#D02E00';

    public configChanged() {
        setTimeout(() => {
            this.initData();
        });
    }

    public currentTimeChanged() {
        if (this.segmentsTimeline) {
            this.segmentsTimeline.currentTime = this.currentTime;
        }
    }

    public connectedCallback() {
        super.connectedCallback();
        this.initData();
    }

    public disconnectedCallback() {
        super.disconnectedCallback();

        window.removeEventListener('resize', this.resize);
        window.removeEventListener(TimelineEvents.JUMP_TO_NEXT_SEGMENT, this.jumpToNextSegment);
        window.addEventListener(TimelineEvents.JUMP_TO_PREVIOUS_SEGMENT, this.jumpToPreviousSegment);
        this.fastSlider?.removeEventListener('change', this.fastSliderChange);
    }

    public initData() {
        if (!this.config) {
            return;
        }

        this.segmentsTimeline = <SegmentsTimelineComponent>(
            this.$fastController.element?.shadowRoot?.querySelector('media-segments-timeline')
        );
        this.timeRuler = <TimeRulerComponent>this.$fastController.element?.shadowRoot?.querySelector('media-time-ruler');

        // Disabling zoom on FireFox since we can't modify the scrollbar on FireFox
        if (navigator.userAgent.includes('Firefox')) {
            this.config.enableZoom = false;
        }

        if (this.config.enableZoom && !this.fastSlider) {
            /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
            this.fastSlider = document.createElement('fast-slider') as any;
            this.$fastController.element.shadowRoot.appendChild(this.fastSlider);
        } else if (!this.fastSlider) {
            this.$fastController.element.style.overflowX = 'hidden';
        }

        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener(TimelineEvents.JUMP_TO_NEXT_SEGMENT, this.jumpToNextSegment.bind(this));
        window.addEventListener(TimelineEvents.JUMP_TO_PREVIOUS_SEGMENT, this.jumpToPreviousSegment.bind(this));
        this.fastSlider?.addEventListener('change', this.fastSliderChange.bind(this));

        this.initTimeLine();
    }

    public jumpToNextSegment(): boolean {
        return this.segmentsTimeline?.jumpToNextSegment();
    }

    public jumpToPreviousSegment(): boolean {
        return this.segmentsTimeline?.jumpToPreviousSegment();
    }

    private initTimeLine() {
        this.initSegmentsTimeline();
        this.initTimeRuler();
        setTimeout(() => {
            this.initSlider();
        }, 50);
    }

    private initSlider() {
        if (!this.config.enableZoom || !this.fastSlider) {
            return;
        }

        const boundingClientRect = this.$fastController.element.getBoundingClientRect();
        this.fastSlider.style.top = `${boundingClientRect.top + boundingClientRect.height - 20}px`;
        this.fastSlider.style.left = `${boundingClientRect.left + boundingClientRect.width - 93}px`;
        this.fastSlider.min = this.SLIDER_DENSITY;
        this.fastSlider.max = this.SLIDER_MAX_ZOOM * this.SLIDER_DENSITY;
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
                zoom: this.zoom
            }
        };

        this.segmentsTimeline.config = config;

        this.segmentsTimeline.addEventListener(SegmentsTimelineEvents.SEGMENT_CLICKED, ((event: CustomEvent<IUISegmentEventData>) => {
            this.$emit(TimelineEvents.SEGMENT_CHANGE, event.detail);
            event.stopPropagation();
            // eslint-disable-next-line no-undef
        }) as EventListener);
    }

    private initTimeRuler() {
        this.timeRuler.startDate = this.config.date || new Date();
        this.timeRuler.zoom = this.zoom;
    }

    private resize() {
        this.initTimeLine();
    }

    private fastSliderChange() {
        this.zoom = +this.fastSlider.value / this.SLIDER_DENSITY;
        this.initSegmentsTimeline();
        this.initTimeRuler();
    }
}
