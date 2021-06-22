import { setElementTooltip } from '../../../../common/utils/elements';
import {
    ARROW_LEFT_PATH,
    ARROW_RIGHT_PATH,
    FORWARD_SVG_PATH,
    FULL_OFF_PATH,
    FULL_PATH,
    METADATA_PATH,
    MUTE_PATH,
    ON_PATH,
    OVERFLOW_MENU_PATH,
    REWIND_SVG_PATH,
    SKIP_NEXT_PATH,
    SKIP_PREV_PATH
} from '../../../../styles/svg/svg.shapes';
import { ControlPanelElementsTooltip } from '../rvx-player.definitions';
import { shaka } from '../index';
import { Localization } from './../../../../common/services/localization/localization.class';
import { ISeekBarElement } from './definitions';

/* eslint-disable @typescript-eslint/no-explicit-any */

export class PlayButton extends shaka.ui.PlayButton {
    private svg: SVGSVGElement;
    private path: SVGPathElement;
    private readonly PATH_PLAY = 'm4 1.336 10.664 6.664-10.664 6.664zm1.336 2.406v8.516l6.813-4.258z';
    private readonly PATH_PAUSE = 'M10 2h1.5v12h-1.5v-12zM4.5 14v-12h1.5v12h-1.5z';
    public constructor(parent: any, controls: any) {
        super(parent, controls);
        this.init();
    }

    public updateIcon() {
        if (this.isPaused()) {
            this.path.setAttribute('d', this.PATH_PLAY);
            setElementTooltip(this.button, ControlPanelElementsTooltip.PLAY);
        } else {
            this.path.setAttribute('d', this.PATH_PAUSE);
            setElementTooltip(this.button, ControlPanelElementsTooltip.PAUSE);
        }
    }

    private init() {
        // Create SVG
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('fill', 'black');
        this.svg.appendChild(this.path);
        this.button.appendChild(this.svg);
        this.updateIcon();
        setElementTooltip(this.button, ControlPanelElementsTooltip.PLAY);
    }
}

export class ForwardButton extends shaka.ui.FastForwardButton {
    public constructor(parent: any, controls: any) {
        super(parent, controls);
        this.init();
    }

    private init() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('fill', 'black');
        this.path.setAttribute('d', FORWARD_SVG_PATH);
        this.svg.appendChild(this.path);
        this.button_.innerText = '';
        this.button_.appendChild(this.svg);
        setElementTooltip(this.button_, ControlPanelElementsTooltip.FAST_FORWARD);
    }
}

export class RewindButton extends shaka.ui.RewindButton {
    public constructor(parent: any, controls: any) {
        super(parent, controls);
        this.init();
    }

    private init() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('fill', 'black');
        this.path.setAttribute('d', REWIND_SVG_PATH);
        this.svg.appendChild(this.path);
        this.button_.innerText = '';
        this.button_.appendChild(this.svg);
        setElementTooltip(this.button_, ControlPanelElementsTooltip.REWIND);
    }
}

export class FullscreenButton extends shaka.ui.FullscreenButton {
    private svg: SVGSVGElement;
    private path: SVGPathElement;

    public constructor(parent: any, controls: any) {
        super(parent, controls);
        this.init();
    }

    public updateIcon_() {
        this.button_.innerText = '';
        this.button_.appendChild(this.svg);
        if (document.fullscreenElement) {
            this.path.setAttribute('d', FULL_PATH);
            setElementTooltip(this.button_, ControlPanelElementsTooltip.FULLSCREEN);
        } else {
            this.path.setAttribute('d', FULL_OFF_PATH);
            setElementTooltip(this.button_, ControlPanelElementsTooltip.EXIT_FULLSCREEN);
        }
    }

    private init() {
        // Create SVG
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('fill', 'black');
        this.svg.appendChild(this.path);
        this.updateIcon_();
        setElementTooltip(this.button_, ControlPanelElementsTooltip.FULLSCREEN);
    }
}

export class MuteButton extends shaka.ui.MuteButton {
    private svg: SVGSVGElement;
    private path: SVGPathElement;

    public constructor(parent: any, controls: any) {
        super(parent, controls);
        this.init();
    }

    public updateIcon_() {
        if (!this.svg) {
            return;
        }
        const path = this.ad ? (this.ad.isMuted() ? MUTE_PATH : ON_PATH) : this.video.muted ? MUTE_PATH : ON_PATH;
        this.button_.innerText = '';
        this.button_.appendChild(this.svg);
        this.path.setAttribute('d', path);
        if (this.ad?.isMuted() || this.video?.muted) {
            setElementTooltip(this.button_, ControlPanelElementsTooltip.UNMUTE);
        } else {
            setElementTooltip(this.button_, ControlPanelElementsTooltip.MUTE);
        }
    }

    private init() {
        // Create SVG
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('fill', 'black');
        this.svg.appendChild(this.path);
        this.updateIcon_();
        setElementTooltip(this.button_, ControlPanelElementsTooltip.MUTE);
    }
}

export class OverflowMenu extends shaka.ui.OverflowMenu {
    private svg: SVGSVGElement;
    private path: SVGPathElement;

    public constructor(parent: any, controls: any) {
        super(parent, controls);
        this.init();
    }

    public createChildren_() {
        super.createChildren_();
        const settingsLabel = document.createElement('label');
        settingsLabel.classList.add('settings-header');
        const settingsSpan = document.createElement('span');
        settingsSpan.innerText = Localization.dictionary.BUTTONS_CLASS_Settings;
        settingsLabel.prepend(settingsSpan);
        this.overflowMenu_.prepend(settingsLabel);
    }

    private init() {
        // Create SVG
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('fill', 'black');
        this.path.setAttribute('d', OVERFLOW_MENU_PATH);
        this.svg.appendChild(this.path);
        this.overflowMenuButton_.innerText = '';
        this.overflowMenuButton_.appendChild(this.svg);
        setElementTooltip(this.overflowMenuButton_, ControlPanelElementsTooltip.OVERFLOW_MENU);

        const backToButtons = this.controls.getVideoContainer().getElementsByClassName('shaka-back-to-overflow-button');
        for (const button of backToButtons) {
            const icon = button.querySelector('.material-icons-round');
            if (icon) {
                button.removeChild(icon);
            }
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill', 'black');
            path.setAttribute('d', ARROW_LEFT_PATH);
            svg.appendChild(path);
            button.prepend(svg);
        }
    }
}

export class LiveButton extends shaka.ui.Element {
    public isLiveButton = true;
    private isLive = true;
    public constructor(parent: any, controls: any, private callBack: (isLive: boolean) => void) {
        super(parent, controls);
        this.init();
    }

    public updateLiveState(isLive: boolean) {
        this.isLive = isLive;
        this.button_.classList.add(this.isLive ? 'live-on' : 'live-off');
        this.button_.classList.remove(this.isLive ? 'live-off' : 'live-on');
        const label = this.isLive ? 'Switch to VOD' : 'Switch to live';
        setElementTooltip(this.button_, label);
    }

    private init() {
        this.button_ = document.createElement('fast-button');
        this.button_.innerHTML = `<b>${Localization.dictionary.BUTTONS_CLASS_Live}</b>`;
        this.button_.classList.add('live-button-component');
        this.parent.appendChild(this.button_);
        setElementTooltip(this.button_, ControlPanelElementsTooltip.LIVE);

        this.eventManager.listen(this.button_, 'click', () => {
            this.isLive = !this.isLive;
            this.callBack(this.isLive);
        });
    }
}

export class NextDayButton extends shaka.ui.Element {
    public constructor(parent: any, controls: any, private callBack: () => void) {
        super(parent, controls);
        this.init();
    }

    private init() {
        this.button_ = document.createElement('fast-button');
        setElementTooltip(this.button_, Localization.dictionary.BUTTONS_CLASS_NextRecordedDay);

        // Create SVG
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        this.path.setAttribute('d', ARROW_RIGHT_PATH);
        this.button_.classList.add('next-day-button');
        this.svg.appendChild(this.path);
        this.button_.appendChild(this.svg);
        this.parent.appendChild(this.button_);
        this.eventManager.listen(this.button_, 'click', () => {
            this.callBack();
        });
    }
}

export class PrevDayButton extends shaka.ui.Element {
    public constructor(parent: any, controls: any, private callBack: () => void) {
        super(parent, controls);
        this.init();
    }

    private init() {
        this.button_ = document.createElement('fast-button');
        setElementTooltip(this.button_, Localization.dictionary.BUTTONS_CLASS_PreviousRecordedDay);

        // Create SVG
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        this.path.setAttribute('d', ARROW_LEFT_PATH);
        this.button_.classList.add('prev-day-button');
        this.svg.appendChild(this.path);
        this.button_.appendChild(this.svg);
        this.parent.appendChild(this.button_);
        this.eventManager.listen(this.button_, 'click', () => {
            this.callBack();
        });
    }
}

export class HoursLabel extends shaka.ui.Element {
    public constructor(parent: any, controls: any) {
        super(parent, controls);
        this.init();
    }

    private init() {
        this.button_ = document.createElement('span');
        this.button_.innerHTML = Localization.dictionary.BUTTONS_CLASS_24Hours;
        this.button_.classList.add('hours-label');
        this.parent.appendChild(this.button_);
        setElementTooltip(this.button_, ControlPanelElementsTooltip.HOURS_LABEL);
    }
}

export class BodyTracking extends shaka.ui.Element {
    private isOn = false;

    public constructor(parent: any, controls: any, private callBack: (isOn: boolean) => void) {
        super(parent, controls);
        this.init();
    }

    public updateIcon_() {
        if (this.isOn) {
            this.button_.classList.add('body-tracking-on');
            setElementTooltip(this.button_, ControlPanelElementsTooltip.META_DATA_LAYER_OFF);
        } else {
            this.button_.classList.remove('body-tracking-on');
            setElementTooltip(this.button_, ControlPanelElementsTooltip.META_DATA_LAYER_ON);
        }
    }

    private init() {
        this.button_ = document.createElement('fast-button');
        // Create SVG
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        this.path.setAttribute('d', METADATA_PATH);
        this.svg.appendChild(this.path);
        this.button_.appendChild(this.svg);
        this.parent.appendChild(this.button_);
        this.updateIcon_();
        setElementTooltip(this.button_, ControlPanelElementsTooltip.META_DATA_LAYER_ON);
        this.eventManager.listen(this.button_, 'click', () => {
            this.isOn = !this.isOn;
            this.updateIcon_();
            this.callBack(this.isOn);
        });
    }
}

export class NextSegment extends shaka.ui.Element {
    public constructor(parent: any, controls: any, private callBack: (isNext: boolean) => void) {
        super(parent, controls);
        this.init();
    }

    private init() {
        this.button_ = document.createElement('fast-button');
        this.button_.setAttribute('title', Localization.dictionary.BUTTONS_CLASS_NextTimeRange);
        // Create SVG
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        this.button_.classList.add('next-segment-button');
        this.path.setAttribute('d', SKIP_NEXT_PATH);
        this.svg.appendChild(this.path);
        this.button_.appendChild(this.svg);
        this.parent.appendChild(this.button_);
        this.eventManager.listen(this.button_, 'click', () => {
            this.callBack(true);
        });
    }
}

export class PrevSegment extends shaka.ui.Element {
    public constructor(parent: any, controls: any, private callBack: (isNext: boolean) => void) {
        super(parent, controls);
        this.init();
    }

    private init() {
        this.button_ = document.createElement('fast-button');
        this.button_.setAttribute('title', Localization.dictionary.BUTTONS_CLASS_PreviousTimeRange);
        // Create SVG
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        this.button_.classList.add('prev-segment-button');
        this.path.setAttribute('d', SKIP_PREV_PATH);
        this.svg.appendChild(this.path);
        this.button_.appendChild(this.svg);
        this.parent.appendChild(this.button_);
        this.eventManager.listen(this.button_, 'click', () => {
            this.callBack(false);
        });
    }
}

export class SeekBarDecorator {
    private timeTooltip: HTMLSpanElement;
    private mouseDisplayContainer: HTMLDivElement;
    public constructor(
        private seekBarElement: ISeekBarElement,
        private video: HTMLElement,
        private computeClock: (time: number) => string
    ) {
        this.seekBarElement.bar.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.seekBarElement.bar.addEventListener('mouseout', this.onMouseOut.bind(this));
    }

    public destroy() {
        this.seekBarElement.bar.removeEventListener('mousemove', this.onMouseMove.bind(this));
        this.seekBarElement.bar.removeEventListener('mouseout', this.onMouseOut.bind(this));
        if (this.mouseDisplayContainer) {
            this.mouseDisplayContainer.removeChild(this.timeTooltip);
            this.seekBarElement.container.removeChild(this.mouseDisplayContainer);

            this.mouseDisplayContainer = null;
            this.timeTooltip = null;
        }
    }

    private onMouseOut() {
        if (this.mouseDisplayContainer) {
            this.mouseDisplayContainer.style.display = 'none';
        }
    }

    private onMouseMove(event: MouseEvent) {
        // eslint-disable-next-line no-console
        event.preventDefault();

        const rect = this.seekBarElement.bar.getBoundingClientRect();
        const min = parseFloat(this.seekBarElement.bar.min);
        const max = parseFloat(this.seekBarElement.bar.max);

        // Calculate the range value based on the touch position.

        // Pixels from the left of the range element
        const touchPosition = event.clientX - rect.left;

        // Pixels per unit value of the range element.
        const scale = (max - min) / rect.width;

        // Touch position in units, which may be outside the allowed range.
        let value = min + scale * touchPosition;

        // Keep value within bounds.
        if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }

        if (!this.mouseDisplayContainer) {
            this.mouseDisplayContainer = document.createElement('div');
            this.mouseDisplayContainer.classList.add('mouse-display-container');

            this.timeTooltip = document.createElement('span');
            this.timeTooltip.classList.add('time-tooltip');

            this.mouseDisplayContainer.prepend(this.timeTooltip);
            this.seekBarElement.container.prepend(this.mouseDisplayContainer);
        }

        this.mouseDisplayContainer.style.display = 'block';
        this.timeTooltip.textContent = this.computeClock(value);

        // Calculate position
        const position = event.pageX - findElPosition(this.mouseDisplayContainer.parentNode).left;
        this.mouseDisplayContainer.style.left = `${position}px`;

        // Calculate tooltip relative
        // eslint-disable-next-line no-unused-vars
        const test: any = window.getComputedStyle(this.video).width;
        const playerWidth = parseFloat(test);
        const tooltipWidthHalf = this.timeTooltip.offsetWidth / 2;
        let actualPosition = position;

        if (position < tooltipWidthHalf) {
            actualPosition = Math.ceil(this.timeTooltip.offsetWidth - position);
        } else if (position > playerWidth - tooltipWidthHalf) {
            actualPosition = Math.floor(playerWidth - position);
        } else {
            actualPosition = tooltipWidthHalf;
        }
        this.timeTooltip.style.right = -actualPosition + 'px';
    }
}

export function findElPosition(el: any) {
    let box;

    if (el.getBoundingClientRect && el.parentNode) {
        box = el.getBoundingClientRect();
    }

    if (!box) {
        return {
            left: 0,
            top: 0
        };
    }

    const docEl: any = document.documentElement;
    const body = document.body;

    const clientLeft = docEl.clientLeft || body.clientLeft || 0;
    const scrollLeft = window.pageXOffset || body.scrollLeft;

    const clientTop = docEl.clientTop || body.clientTop || 0;
    const scrollTop = window.pageYOffset || body.scrollTop;

    const top = box.top + scrollTop - clientTop;
    let left;

    /*
    When zoomed on a Microsoft device on Edge or IE, getBoundingClientRect() returns
    the left value differently.  Normally the value would be relative to the viewport,
    and we thus have to take into account and compensate for the leftScroll.  When zoomed,
    the value is already accounted for and the further you scroll to the right, the further
    the pointer thinks it is from where you are trying to tap or touch.
      docEl.msContentZoomFactor only exists on IE and Edge, so we can safely use it as a check
    to determine if we are dealing with Edge or IE, and then again to verify it is in fact zoomed.
    */

    // check if this is zoomed on a Microsoft touchscreen device.
    const zoomFactor = docEl.msContentZoomFactor;

    if (zoomFactor && zoomFactor > 1) {
        // don't account for scrollLeft as zooming already is
        left = box.left - clientLeft;
    } else {
        // otherwise just calculate like normal accounting for scrollLeft
        left = box.left + scrollLeft - clientLeft;
    }

    // Android sometimes returns slightly off decimal values, so need to round
    return {
        left: Math.round(left),
        top: Math.round(top)
    };
}
