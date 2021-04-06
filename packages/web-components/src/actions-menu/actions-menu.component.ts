import { FASTMenu } from '@microsoft/fast-components';
import { attr, customElement, FASTElement } from '@microsoft/fast-element';
import { keyCodeEnter, keyCodeSpace } from '@microsoft/fast-web-utilities';
import { IAction } from './actions-menu.definitions';
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
    @attr public opened: boolean = false;

    private fastMenu: FASTMenu;

    public openedChanged() {
        if (this.opened) {
            setTimeout(() => {
                if (!this.fastMenu) {
                    this.fastMenu = this.$fastController.element.shadowRoot.querySelector('fast-menu');
                }
                this.initMenu();
            }, 50);
        }
    }

    public connectedCallback() {
        super.connectedCallback();

        window.addEventListener('resize', () => {
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
        this.$emit('action-clicked', action);
    }

    public handleMenuItemKeyDown = (e: KeyboardEvent, action: IAction): boolean => {
        switch (e.keyCode) {
            case keyCodeEnter:
            case keyCodeSpace:
                this.handleMenuItemClick(action);
                return false;
        }

        return true;
    };

    public handleFocusOut(event: FocusEvent) {
        if (!event.relatedTarget) {
            this.opened = false;
        }
    }

    private initMenu() {
        if (!this.fastMenu) {
            return;
        }

        const fastMenuClientRect = this.fastMenu.$fastController.element.getBoundingClientRect();

        const boundingClientRect = this.$fastController.element.getBoundingClientRect();
        const windowClientRect = window.document.querySelector('html')?.getBoundingClientRect();

        // Checking opening directions
        // Checking top / bottom opening
        if (windowClientRect.height + windowClientRect.top > boundingClientRect.bottom + fastMenuClientRect.height) {
            this.fastMenu.style.top = `${boundingClientRect.bottom}px`;
        } else {
            this.fastMenu.style.top = `${boundingClientRect.top - fastMenuClientRect.height - windowClientRect.top}px`;
        }

        // Checking left / right opening
        if (windowClientRect.width > boundingClientRect.left + fastMenuClientRect.width) {
            this.fastMenu.style.left = `${boundingClientRect.left}px`;
        } else {
            this.fastMenu.style.left = `${boundingClientRect.right - fastMenuClientRect.width}px`;
        }

        this.fastMenu.style.visibility = 'visible';
    }
}
