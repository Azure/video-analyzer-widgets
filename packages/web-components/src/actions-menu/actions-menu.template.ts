import { html, repeat, when } from '@microsoft/fast-element';
import { ActionsMenuComponent } from './actions-menu.component';
import { MORE_SVG_PATH } from '../../../styles/svg/svg.shapes';
import { IAction } from './actions-menu.definitions';

/**
 * The template for the actions menu component.
 * @public
 */
/* eslint-disable  @typescript-eslint/indent */
export const template = html<ActionsMenuComponent>`
    <template>
        <fast-button
            appearance="stealth"
            aria-label="Options"
            title="Options"
            @focusout="${(x, c) => x.handleFocusOut(c.event as FocusEvent)}"
            @click="${(x) => x.toggleMenu()}"
        >
            <svg>
                <path d="${MORE_SVG_PATH}"></path>
            </svg>
        </fast-button>
        <div class="fast-menu-container">
            ${when(
                (x) => x.opened === true,
                html` <fast-menu connectedCallback="${(x) => x.menuConnectedCallback()}">
                    ${repeat(
                        (x) => x.actions,
                        html<IAction>`
                            <fast-menu-item
                                aria-label="${(x) => x.label}"
                                title="${(x) => x.label}"
                                aria-disabled="${(x) => x.disabled}"
                                @focusout="${(x, c) => c.parent.handleFocusOut(c.event as FocusEvent)}"
                                @keyup="${(x, c) => c.parent.handleMenuItemKeyUp(c.event as KeyboardEvent, x)}"
                                @mouseup="${(x, c) => c.parent.handleMenuItemMouseUp(c.event as MouseEvent, x)}"
                            >
                                ${when(
                                    (x) => x.svgPath,
                                    html<IAction>`
                                        <svg slot="start">
                                            <path d="${(x) => x.svgPath}"></path>
                                        </svg>
                                    `
                                )}
                                ${(x) => x.label}</fast-menu-item
                            >
                        `,
                        { positioning: true }
                    )}
                </fast-menu>`
            )}
        </div>
    </template>
`;
