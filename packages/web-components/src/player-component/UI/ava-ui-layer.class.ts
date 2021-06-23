import { TimelineComponent } from '../../timeline';
import { ControlPanelElements } from '../player-component.definitions';
import { ISeekBarElement } from './definitions';
import { ForwardButton, FullscreenButton, MuteButton, OverflowMenu, PlayButton, RewindButton, SeekBarDecorator } from './ui.class';
import {
    BodyTrackingButtonFactory,
    ForwardButtonFactory,
    FullscreenButtonFactory,
    HoursLabelFactory,
    LiveButtonFactory,
    MuteButtonFactory,
    NextDayButtonFactory,
    NextSegmentButtonFactory,
    OverflowMenuFactory,
    PlayButtonFactory,
    PrevDayButtonFactory,
    PrevSegmentButtonFactory,
    RewindButtonFactory
} from './ui.factory';

/**
 * AVAPlayerUILayer
 * Adds AVA Player UI controllers and listeners
 */
export class AVAPlayerUILayer {
    private _uiConfiguration = {
        controlPanelElements: [
            ControlPanelElements.PREV_SEGMENT,
            ControlPanelElements.REWIND,
            ControlPanelElements.PLAY_PAUSE,
            ControlPanelElements.FAST_FORWARD,
            ControlPanelElements.NEXT_SEGMENT,
            ControlPanelElements.LIVE,
            ControlPanelElements.MUTE,
            ControlPanelElements.VOLUME,
            ControlPanelElements.PREVIOUS_DAY,
            ControlPanelElements.NEXT_DAY,
            ControlPanelElements.HOURS_LABEL,
            ControlPanelElements.SPACER,
            ControlPanelElements.META_DATA_LAYER,
            ControlPanelElements.OVERFLOW_MENU,
            ControlPanelElements.FULLSCREEN
        ],
        addBigPlayButton: false,
        overflowMenuButtons: ['playback_rate', 'quality'],
        seekBarColors: {
            base: 'var(--video-buffer)',
            buffered: 'var(--video-buffer)',
            played: 'var(--segment-live)'
        }
    };

    private seekBarDecorator: SeekBarDecorator;
    public constructor(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private shaka: any,
        private toggleLiveMode: (isLive: boolean) => void,
        private toggleBodyTracking: (isOn: boolean) => void,
        private nextDayCallBack: () => void,
        private prevDayCallBack: () => void,
        private jumpSegmentCallBack: (isNext: boolean) => void,
        private allowedControllers: ControlPanelElements[]
    ) {
        this.createControllers();
        this.updateAvailableControllers();
    }

    public get uiConfiguration() {
        return this._uiConfiguration;
    }

    public set uiConfiguration(value) {
        this._uiConfiguration = value;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public addLiveSeekBarTooltip(controls: any, computeClock: (time: number) => string) {
        this.seekBarDecorator?.destroy();
        const seekBarElement: ISeekBarElement = {
            bar: controls.seekBar_.bar,
            container: controls.seekBar_.container
        };
        this.seekBarDecorator = new SeekBarDecorator(seekBarElement, controls.localVideo_, computeClock);
    }

    public destroySeekBar() {
        this.seekBarDecorator?.destroy();
    }

    public addTimelineSeekBarTooltip(timeline: TimelineComponent, video: HTMLElement, computeClock: (time: number) => string) {
        this.seekBarDecorator?.destroy();
        this.seekBarDecorator = new SeekBarDecorator(timeline.seekBarElement, video, computeClock);
    }

    private updateAvailableControllers() {
        // If no allowed controllers provided use default
        if (!this.allowedControllers) {
            return;
        }

        const newControlPanelElements = [];

        for (const iterator of this._uiConfiguration.controlPanelElements) {
            const index = this.allowedControllers.indexOf(iterator);

            if (index > -1) {
                newControlPanelElements.push(iterator);
            }
        }

        this._uiConfiguration.controlPanelElements = newControlPanelElements;
    }

    private createControllers() {
        this.shaka.util.Dom.createButton = this.createButton;

        this.shaka.ui.PlayButton = PlayButton;
        this.shaka.ui.PlayButton.Factory = PlayButtonFactory;
        this.shaka.ui.Controls.registerElement(ControlPanelElements.PLAY_PAUSE, new this.shaka.ui.PlayButton.Factory());

        this.shaka.ui.FastForwardButton = ForwardButton;
        this.shaka.ui.FastForwardButton.Factory = ForwardButtonFactory;
        this.shaka.ui.Controls.registerElement(ControlPanelElements.FAST_FORWARD, new this.shaka.ui.FastForwardButton.Factory());

        this.shaka.ui.RewindButton = RewindButton;
        this.shaka.ui.RewindButton.Factory = RewindButtonFactory;
        this.shaka.ui.Controls.registerElement(ControlPanelElements.REWIND, new this.shaka.ui.RewindButton.Factory());

        this.shaka.ui.FullscreenButton = FullscreenButton;
        this.shaka.ui.FullscreenButton.Factory = FullscreenButtonFactory;
        this.shaka.ui.Controls.registerElement(ControlPanelElements.FULLSCREEN, new this.shaka.ui.FullscreenButton.Factory());

        this.shaka.ui.MuteButton = MuteButton;
        this.shaka.ui.MuteButton.Factory = MuteButtonFactory;
        this.shaka.ui.Controls.registerElement(ControlPanelElements.MUTE, new this.shaka.ui.MuteButton.Factory());

        this.shaka.ui.OverflowMenu = OverflowMenu;
        this.shaka.ui.OverflowMenu.Factory = OverflowMenuFactory;
        this.shaka.ui.Controls.registerElement(ControlPanelElements.OVERFLOW_MENU, new this.shaka.ui.OverflowMenu.Factory());

        this.shaka.ui.OverflowMenu = OverflowMenu;
        this.shaka.ui.OverflowMenu.Factory = OverflowMenuFactory;
        this.shaka.ui.Controls.registerElement(ControlPanelElements.OVERFLOW_MENU, new this.shaka.ui.OverflowMenu.Factory());

        LiveButtonFactory.callBack = async (isLive: boolean) => {
            this.toggleLiveMode(isLive);
        };

        this.shaka.ui.Controls.registerElement(ControlPanelElements.LIVE, new LiveButtonFactory());

        BodyTrackingButtonFactory.callBack = (isOn: boolean) => {
            this.toggleBodyTracking(isOn);
        };
        this.shaka.ui.Controls.registerElement(ControlPanelElements.META_DATA_LAYER, new BodyTrackingButtonFactory());

        NextSegmentButtonFactory.callBack = (isNext: boolean) => {
            this.jumpSegmentCallBack(isNext);
        };
        this.shaka.ui.Controls.registerElement(ControlPanelElements.NEXT_SEGMENT, new NextSegmentButtonFactory());

        PrevSegmentButtonFactory.callBack = (isNext: boolean) => {
            this.jumpSegmentCallBack(isNext);
        };
        this.shaka.ui.Controls.registerElement(ControlPanelElements.PREV_SEGMENT, new PrevSegmentButtonFactory());

        NextDayButtonFactory.callBack = () => {
            this.nextDayCallBack();
        };
        this.shaka.ui.Controls.registerElement(ControlPanelElements.NEXT_DAY, new NextDayButtonFactory());

        PrevDayButtonFactory.callBack = () => {
            this.prevDayCallBack();
        };
        this.shaka.ui.Controls.registerElement(ControlPanelElements.PREVIOUS_DAY, new PrevDayButtonFactory());

        this.shaka.ui.Controls.registerElement(ControlPanelElements.HOURS_LABEL, new HoursLabelFactory());
    }

    private createButton() {
        return document.createElement('fast-button');
    }
}
