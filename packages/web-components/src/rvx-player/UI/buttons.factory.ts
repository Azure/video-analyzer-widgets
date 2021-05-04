import { BodyTracking, LiveButton } from './buttons.class';

/* eslint-disable @typescript-eslint/no-explicit-any */
const shaka = require('shaka-player/dist/shaka-player.ui.debug.js');

export class PlayButtonFactory {
    public create(rootElement: any, controls: any) {
        return new shaka.ui.PlayButton(rootElement, controls);
    }
}

export class ForwardButtonFactory {
    public create(rootElement: any, controls: any) {
        return new shaka.ui.FastForwardButton(rootElement, controls);
    }
}

export class RewindButtonFactory {
    public create(rootElement: any, controls: any) {
        return new shaka.ui.RewindButton(rootElement, controls);
    }
}

export class FullscreenButtonFactory {
    public create(rootElement: any, controls: any) {
        return new shaka.ui.FullscreenButton(rootElement, controls);
    }
}

export class MuteButtonFactory {
    public create(rootElement: any, controls: any) {
        return new shaka.ui.MuteButton(rootElement, controls);
    }
}

export class OverflowMenuFactory {
    public create(rootElement: any, controls: any) {
        return new shaka.ui.OverflowMenu(rootElement, controls);
    }
}

export class LiveButtonFactory {
    public static callBack: (isLive: boolean) => void;
    public create(rootElement: any, controls: any) {
        return new LiveButton(rootElement, controls, LiveButtonFactory.callBack);
    }
}

export class BodyTrackingButtonFactory {
    public static callBack: (isOn: boolean) => void;
    public create(rootElement: any, controls: any) {
        return new BodyTracking(rootElement, controls, BodyTrackingButtonFactory.callBack);
    }
}
