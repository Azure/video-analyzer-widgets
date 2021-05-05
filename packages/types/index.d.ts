/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Player } from '../widgets/src';

export {};

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
    }
}
