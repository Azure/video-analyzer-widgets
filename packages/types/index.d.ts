/* eslint-disable @typescript-eslint/no-unused-expressions */

import { Player } from '../widgets/src';
import { ZoneDrawerWidget } from './../widgets/src/zone-drawer/zone-drawer.widget';

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
