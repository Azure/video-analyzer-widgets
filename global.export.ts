/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Player } from './packages/widgets/src/player/player-widget';
import { FASTButton, FASTMenu, FASTMenuItem, FASTSlider } from '@microsoft/fast-components';
import { ZoneDrawer } from './packages/widgets/src/zone-drawer/zone-drawer.widget';

Player;
FASTButton;
FASTMenu;
FASTMenuItem;
FASTSlider;
ZoneDrawer;

export const widgets = {
    player: Player,
    zoneDrawer: ZoneDrawer
};
