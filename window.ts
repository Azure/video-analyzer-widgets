import { RVXWidget, ZoneDrawWidget } from './packages/widgets/src';

declare global {
    interface IWidgets {
        rvx: typeof RVXWidget;
        zoneDraw: typeof ZoneDrawWidget;
    }

    interface IAva {
        widgets: IWidgets;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    export interface Window {
        ava: IAva;
    }
}
