import { Player } from './packages/widgets/src';

declare global {
    interface IWidgets {
        player: typeof Player;
    }

    interface IAva {
        widgets: IWidgets;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    export interface Window {
        ava: IAva;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fabric?: any;
    }
}
