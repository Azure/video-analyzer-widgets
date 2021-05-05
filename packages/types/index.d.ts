import { Player, ZoneDrawerWidget } from '../widgets/src';

export { };

interface IAva {
    widgets: {
        player: Player;
        zoneDrawer: ZoneDrawerWidget;
    };
}

declare global {
    interface Window {
        ava: IAva;
    }
}
