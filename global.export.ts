import { Player } from './packages/widgets/src';

window.ava = window.ava || { widgets: { player: Player } };
window.ava.widgets = window.ava.widgets || { player: Player };
window.ava.widgets.player = Player;
