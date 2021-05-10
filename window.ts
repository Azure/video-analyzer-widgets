import { RVXWidget, ZoneDrawerWidget } from './packages/widgets/src';

declare global {
    interface IWidgets {
        rvx: typeof RVXWidget;
        zoneDrawer: typeof ZoneDrawerWidget;
    }

    interface IAva {
        widgets: IWidgets;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    export interface Window {
        ava: IAva;
    }
}
