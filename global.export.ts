import { Player } from './packages/widgets/src/rvx/rvx-widget';
import { ZoneDrawerWidget } from './packages/widgets/src/zone-drawer';

window.ava = window.ava || { widgets: { player: Player, zoneDrawer: ZoneDrawerWidget } };
window.ava.widgets = window.ava.widgets || { player: Player, zoneDrawer: ZoneDrawerWidget };
window.ava.widgets.player = Player;
window.ava.widgets.zoneDrawer = ZoneDrawerWidget;
