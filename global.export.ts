/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ZoneDrawerWidget } from './packages/widgets/src';
import { Player } from './packages/widgets/src/rvx/rvx-widget';
import { FASTButton, FASTMenu, FASTMenuItem } from '@microsoft/fast-components';

Player;
FASTButton;
FASTMenu;
FASTMenuItem;
ZoneDrawerWidget;

export const widgets = {
    player: Player,
    zoneDrawer: ZoneDrawerWidget
};
