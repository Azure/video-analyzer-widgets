/* eslint-disable @typescript-eslint/no-explicit-any */
const shaka = require('shaka-player/dist/shaka-player.ui.debug.js');

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
        } else {
            this.path.setAttribute('d', this.PATH_PAUSE);
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
    }
}

export class ForwardButton extends shaka.ui.FastForwardButton {
    private readonly PATH_FORWARD =
        'm1.461 2.047 5.953 5.953-5.953 5.953-1.414-1.414 4.539-4.539-4.539-4.539zm13.953 5.953-5.953 5.953-1.414-1.414 4.539-4.539-4.539-4.539 1.414-1.414z';
    public constructor(parent: any, controls: any) {
        super(parent, controls);
        this.init();
    }

    private init() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('fill', 'black');
        this.path.setAttribute('d', this.PATH_FORWARD);
        this.svg.appendChild(this.path);
        this.button_.innerText = '';
        this.button_.appendChild(this.svg);
    }
}

export class RewindButton extends shaka.ui.RewindButton {
    private readonly PATH_REWIND =
        'm11.414 8 4.539 4.539-1.414 1.414-5.953-5.953 5.953-5.953 1.414 1.414zm-3.461-4.539-4.539 4.539 4.539 4.539-1.414 1.414-5.953-5.953 5.953-5.953z';
    public constructor(parent: any, controls: any) {
        super(parent, controls);
        this.init();
    }

    private init() {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('fill', 'black');
        this.path.setAttribute('d', this.PATH_REWIND);
        this.svg.appendChild(this.path);
        this.button_.innerText = '';
        this.button_.appendChild(this.svg);
    }
}

export class FullscreenButton extends shaka.ui.FullscreenButton {
    private svg: SVGSVGElement;
    private path: SVGPathElement;
    private readonly PATH_FULL_OFF = 'M15 1v5h-1v-3.289l-11.289 11.289h3.289v1h-5v-5h1v3.289l11.289-11.289h-3.289v-1h5z';
    private readonly PATH_FULL =
        'M2 9h5v5h-1v-3.289l-5.273 5.266-0.703-0.703 5.266-5.273h-3.289v-1zM10.711 6h3.289v1h-5v-5h1v3.289l5.273-5.266 0.703 0.703-5.266 5.273z';

    public constructor(parent: any, controls: any) {
        super(parent, controls);
        this.init();
    }

    public updateIcon_() {
        this.button_.innerText = '';
        this.button_.appendChild(this.svg);
        if (document.fullscreenElement) {
            this.path.setAttribute('d', this.PATH_FULL);
        } else {
            this.path.setAttribute('d', this.PATH_FULL_OFF);
        }
    }

    private init() {
        // Create SVG
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('fill', 'black');
        this.svg.appendChild(this.path);
        this.updateIcon_();
    }
}

export class MuteButton extends shaka.ui.MuteButton {
    private svg: SVGSVGElement;
    private path: SVGPathElement;
    private readonly PATH_ON =
        'M13.070 0.93q0.703 0.703 1.25 1.523t0.914 1.719 0.57 1.867 0.195 1.961q0 1-0.195 1.961t-0.563 1.867-0.922 1.719-1.25 1.523l-0.711-0.711q0.633-0.633 1.125-1.367t0.828-1.547 0.508-1.68 0.172-1.766-0.172-1.766-0.508-1.672-0.828-1.547-1.125-1.375l0.711-0.711zM13 8q0 1.406-0.531 2.68t-1.516 2.273l-0.711-0.711q0.852-0.852 1.305-1.945t0.453-2.297-0.453-2.297-1.305-1.945l0.711-0.711q0.984 1 1.516 2.273t0.531 2.68zM8.828 5.172q0.57 0.57 0.867 1.297t0.305 1.531q0 0.805-0.297 1.531t-0.875 1.297l-0.703-0.703q0.422-0.422 0.648-0.969t0.227-1.156q0-0.602-0.227-1.148t-0.648-0.977l0.703-0.703zM5.289 2h0.711v12h-0.703l-3.008-3h-2.289v-6h2.289l3-3zM5 3.711l-2.289 2.289h-1.711v4h1.711l2.289 2.289v-8.578z';
    private readonly PATH_MUTE =
        'M6 2h-0.711l-3 3h-2.289v6h2.289l3.008 3h0.703v-12zM5 3.711v8.578l-2.289-2.289h-1.711v-4h1.711l2.289-2.289zM13.657 5.707l-0.707-0.707-2.121 2.121-2.121-2.121-0.707 0.707 2.121 2.121-2.121 2.121 0.707 0.707 2.121-2.121 2.121 2.121 0.707-0.707-2.121-2.121 2.121-2.121z';
    public constructor(parent: any, controls: any) {
        super(parent, controls);
        this.init();
    }

    public updateIcon_() {
        const path = this.ad ? (this.ad.isMuted() ? this.PATH_MUTE : this.PATH_ON) : this.video.muted ? this.PATH_MUTE : this.PATH_ON;
        this.button_.innerText = '';
        this.button_.appendChild(this.svg);
        this.path.setAttribute('d', path);
    }

    private init() {
        // Create SVG
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('fill', 'black');
        this.svg.appendChild(this.path);
        this.updateIcon_();
    }
}

export class OverflowMenu extends shaka.ui.OverflowMenu {
    // private init() {
    //     // const fastButton = document.createElement('fast-button');
    //     // fastButton.innerText = 'Menu';
    //     this.overflowMenuButton_.innerText = 'Menu';
    //     // this.overflowMenuButton_.setAttribute('tabindex', '-1');
    //     // this.overflowMenuButton_.appendChild(fastButton);
    // }

    private svg: SVGSVGElement;
    private path: SVGPathElement;
    private readonly PATH_OVERFLOW_MENU =
        'M13.93 7.719q0 0.070 0.004 0.141t0.004 0.141-0.004 0.141-0.004 0.141l2.023 1.258-1.242 2.992-2.32-0.531q-0.188 0.203-0.391 0.391l0.531 2.32-2.992 1.242-1.258-2.023q-0.070 0-0.141 0.004t-0.141 0.004-0.141-0.004-0.141-0.004l-1.258 2.023-2.992-1.242 0.531-2.32q-0.203-0.188-0.391-0.391l-2.32 0.531-1.242-2.992 2.023-1.258q0-0.070-0.004-0.141t-0.004-0.141 0.004-0.141 0.004-0.141l-2.023-1.258 1.242-2.992 2.32 0.531q0.188-0.203 0.391-0.391l-0.531-2.32 2.992-1.242 1.258 2.023q0.070 0 0.141-0.004t0.141-0.004 0.141 0.004 0.141 0.004l1.258-2.023 2.992 1.242-0.531 2.32q0.203 0.188 0.391 0.391l2.32-0.531 1.242 2.992zM13.016 8.734q0.016-0.188 0.031-0.371t0.016-0.371q0-0.18-0.016-0.367t-0.031-0.367l1.844-1.148-0.672-1.625-2.117 0.492q-0.242-0.297-0.496-0.547t-0.551-0.5l0.492-2.117-1.625-0.672-1.156 1.844q-0.18-0.016-0.367-0.031t-0.367-0.016q-0.188 0-0.371 0.016t-0.371 0.031l-1.148-1.844-1.625 0.672 0.492 2.117q-0.297 0.242-0.547 0.496t-0.5 0.551l-2.117-0.492-0.672 1.625 1.844 1.156q-0.016 0.188-0.031 0.371t-0.016 0.371q0 0.18 0.016 0.367t0.031 0.367l-1.844 1.148 0.672 1.625 2.117-0.492q0.242 0.297 0.496 0.547t0.551 0.5l-0.492 2.117 1.625 0.672 1.156-1.844q0.18 0.016 0.367 0.031t0.367 0.016q0.188 0 0.371-0.016t0.371-0.031l1.148 1.844 1.625-0.672-0.492-2.117q0.297-0.242 0.547-0.496t0.5-0.551l2.117 0.492 0.672-1.625zM8 5.063q0.609 0 1.145 0.23t0.934 0.629 0.629 0.934 0.23 1.145-0.23 1.145-0.629 0.934-0.934 0.629-1.145 0.23-1.145-0.23-0.934-0.629-0.629-0.934-0.23-1.145 0.23-1.145 0.629-0.934 0.934-0.629 1.145-0.23zM8 10.063q0.43 0 0.805-0.16t0.656-0.441 0.441-0.656 0.16-0.805-0.16-0.805-0.441-0.656-0.656-0.441-0.805-0.16-0.805 0.16-0.656 0.441-0.441 0.656-0.16 0.805 0.16 0.805 0.441 0.656 0.656 0.441 0.805 0.16z';

    public constructor(parent: any, controls: any) {
        super(parent, controls);
        this.init();
    }

    private init() {
        // Create SVG
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path.setAttribute('fill', 'black');
        this.path.setAttribute('d', this.PATH_OVERFLOW_MENU);
        this.svg.appendChild(this.path);
        this.overflowMenuButton_.innerText = '';
        this.overflowMenuButton_.appendChild(this.svg);
    }
}

export class LiveButton extends shaka.ui.Element {
    private isLive = true;
    public constructor(parent: any, controls: any, private callBack: (isLive: boolean) => void) {
        super(parent, controls);
        this.init();
    }

    private init() {
        this.button_ = document.createElement('fast-button');
        this.button_.innerText = 'LIVE';
        this.button_.classList.add('live-button-component');
        this.button_.classList.add('live-on');
        this.parent.appendChild(this.button_);

        this.eventManager.listen(this.button_, 'click', () => {
            this.isLive = !this.isLive;
            // this.button_.classList.add(this.isLive ? 'live-on' : 'live-off');
            // this.button_.classList.remove(this.isLive ? 'live-off' : 'live-on');
            this.callBack(this.isLive);
        });
    }
}
