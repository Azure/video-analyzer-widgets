import { HoursLabel, LiveButton, NextDayButton, NextSegment, PrevDayButton, PrevSegment, MetaDataButton } from './ui.class';
import { shaka } from '../index';

/* eslint-disable @typescript-eslint/no-explicit-any */

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
    public static callBack: () => void;
    public create(rootElement: any, controls: any) {
        return new shaka.ui.FullscreenButton(rootElement, controls, FullscreenButtonFactory.callBack);
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


export class NextDayButtonFactory {
    public static callBack: () => void;
    public create(rootElement: any, controls: any) {
        return new NextDayButton(rootElement, controls, NextDayButtonFactory.callBack);
    }
}

export class PrevDayButtonFactory {
    public static callBack: () => void;
    public create(rootElement: any, controls: any) {
        return new PrevDayButton(rootElement, controls, PrevDayButtonFactory.callBack);
    }
}

export class HoursLabelFactory {
    public create(rootElement: any, controls: any) {
        return new HoursLabel(rootElement, controls);
    }
}

export class NextSegmentButtonFactory {
    public static callBack: (isNext: boolean) => void;
    public create(rootElement: any, controls: any) {
        return new NextSegment(rootElement, controls, NextSegmentButtonFactory.callBack);
    }
}

export class PrevSegmentButtonFactory {
    public static callBack: (isNext: boolean) => void;
    public create(rootElement: any, controls: any) {
        return new PrevSegment(rootElement, controls, PrevSegmentButtonFactory.callBack);
    }
}

export class MetaDataButtonFactory {
    public static BoxCallBack: () => void;
    public static AttributesCallBack: () => void;
    public static TrackingCallBack: () => void;
    public create(rootElement: any, controls: any) {
        return new MetaDataButton(
            rootElement,
            controls,
            MetaDataButtonFactory.BoxCallBack,
            MetaDataButtonFactory.AttributesCallBack,
            MetaDataButtonFactory.TrackingCallBack
        );
    }
}
