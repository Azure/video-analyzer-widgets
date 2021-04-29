import { Player } from './packages/widgets/src/rvx/rvx-widget';

window.ava = window.ava || { widgets: { player: Player } };
window.ava.widgets = window.ava.widgets || { player: Player };
window.ava.widgets.player = Player;
