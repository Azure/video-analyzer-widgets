/* eslint-disable @typescript-eslint/no-explicit-any */
export const shaka = require('shaka-player/dist/shaka-player.ui.debug.js');
(window as any).shaka = shaka;

export { PlayerComponent } from './player-component';
