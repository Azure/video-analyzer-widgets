import { FASTMenu } from '@microsoft/fast-components';
import { attr, customElement, FASTElement } from '@microsoft/fast-element';
import { keyCodeEnter, keyCodeSpace } from '@microsoft/fast-web-utilities';
import { ActionsMenuEvents, IAction } from './actions-menu.definitions';
import { styles } from './actions-menu.style';
import { template } from './actions-menu.template';

/**
 * An actions menu web component.
 * @public
 */
@customElement({
    name: 'media-actions-menu',
    template,
    styles
})
export class ActionsMenuComponent extends FASTElement {
    /**
     * The actions list of the menu.
     *
     * @public
     * @remarks
     * HTML attribute: actions
     */
    @attr public actions: IAction[] = [];

    /**
     * The actions list menu state.
     *
     * @public
     * @remarks
     * HTML attribute: opened
     */
    @attr({ attribute: 'edit-mode', mode: 'boolean' })
    public opened: boolean = false;

    private fastMenu: FASTMenu;

    public connectedCallback() {
        super.connectedCallback();

        window.addEventListener('resize', this.initMenu.bind(this));
    }

    public disconnectedCallback() {
        super.disconnectedCallback();

        window.removeEventListener('resize', this.initMenu);
    }

    public menuConnectedCallback() {
        setTimeout(() => {
            this.fastMenu = this.shadowRoot?.querySelector('fast-menu');
            this.initMenu();
        });
    }

    public toggleMenu() {
        this.opened = !this.opened;

        if (!this.opened && this.fastMenu) {
            this.fastMenu.style.visibility = 'hidden';
        }
    }

    public handleMenuItemClick(action: IAction) {
        this.$emit(ActionsMenuEvents.ActionClicked, action);
    }

    public handleMenuItemMouseUp(e: MouseEvent, action: IAction): boolean {
        switch (e.which) {
            case 1: // left mouse button.
                this.handleMenuItemClick(action);
                return false;
        }

        return true;
    }

    public handleMenuItemKeyUp(e: KeyboardEvent, action: IAction): boolean {
        switch (e.keyCode) {
            case keyCodeEnter:
            case keyCodeSpace:
                this.handleMenuItemClick(action);
                return false;
        }

        return true;
    }

    public handleFocusOut(event: FocusEvent) {
        if (!event.relatedTarget || !this.shadowRoot.contains(<Node>event.relatedTarget)) {
            this.opened = false;
        }
    }

    private initMenu() {
        if (!this.fastMenu) {
            return;
        }

        const fastMenuClientRect = this.fastMenu.$fastController?.element?.getBoundingClientRect();

        const boundingClientRect = this.$fastController.element.getBoundingClientRect();

        // Checking opening directions
        // Checking top / bottom opening
        if (window.innerHeight < boundingClientRect.bottom + fastMenuClientRect?.height) {
            this.fastMenu.style.bottom = `30px`;
        } else {
            this.fastMenu.style.bottom = 'auto';
        }

        // Checking left / right opening
        if (boundingClientRect.left + boundingClientRect.width < boundingClientRect.left + fastMenuClientRect?.width) {
            this.fastMenu.style.right = `0px`;
        } else {
            this.fastMenu.style.right = `auto`;
        }

        this.fastMenu.style.visibility = 'visible';
    }
}
