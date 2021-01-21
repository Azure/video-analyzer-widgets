import { RVXWidget } from './packages/widgets/src';

declare global {
    interface IWidgets {
        rvx: typeof RVXWidget;
    }

    interface IAva {
        widgets: IWidgets;
    }

    export interface Window {
        ava: IAva;
    }
}
