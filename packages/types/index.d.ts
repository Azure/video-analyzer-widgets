/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Player, ZoneDrawerWidget } from '../widgets/src';

export {};

declare global {
    interface IWidgets {
        player: typeof Player;
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
