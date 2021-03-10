import { attr, customElement } from '@microsoft/fast-element';
import { Drawer } from '../drawer/drawer.class';
import { styles } from './line-drawer-component.style';

/**
 * An line-drawer-component item.
 * @public
 */
@customElement({
    name: 'line-drawer-component',
    styles
})
export class LineDrawerComponent extends Drawer {

    /**
     * Drawing line color.
     *
     * @public
     * @remarks
     * HTML attribute: borderColor
    */
    @attr public borderColor: string = '';

    /**
    * The width of the canvas required to create.
    *
    * @public
    * @remarks
    * HTML attribute: canvasWidth
    */
    @attr public canvasWidth: string = '';

    /**
    * The height of the canvas required to create.
    *
    * @public
    * @remarks
    * HTML attribute: canvasHeight
    */
    @attr public canvasHeight: string = '';

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        super.initDraw(this.canvasWidth, this.canvasHeight, this.borderColor);
    }

    // When complete to draw, trigger event with the dots

}
