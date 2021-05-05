import { ZoneDrawerWidget } from './packages/widgets/src';
import { Player } from './packages/widgets/src';

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
