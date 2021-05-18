/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ZoneDrawerWidget } from './packages/widgets/src';
import { Player } from './packages/widgets/src/rvx/rvx-widget';
import { FASTButton, FASTMenu, FASTMenuItem, FASTSlider } from '@microsoft/fast-components';

Player;
FASTButton;
FASTMenu;
FASTMenuItem;
ZoneDrawerWidget;
FASTSlider;

export const widgets = {
    player: Player,
    zoneDrawer: ZoneDrawerWidget
};
