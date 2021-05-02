import { Player } from '../widgets/src';

export {};

interface IAva {
    widgets: {
        player: Player;
    };
}

declare global {
    interface Window {
        ava: IAva;
    }
}
