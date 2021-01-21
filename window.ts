import { RVXWidget } from './packages/widgets/src';

declare global {
    interface IWidgets {
        rvx: typeof RVXWidget;
    }

    interface IAva {
        widgets: IWidgets;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    export interface Window {
        ava: IAva;
    }
}
