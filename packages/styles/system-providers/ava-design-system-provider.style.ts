import { css } from '@microsoft/fast-element';
import { SegoeUIFontFamily } from './ava-design-system-provider.definitions';

export const style = css`
    :host {
        display: block;
        font-display: swap;
        background: var(--background-color);
        font-family: ${SegoeUIFontFamily};
        --body-font: ${SegoeUIFontFamily};
    }
`;
