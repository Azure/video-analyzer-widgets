import { css } from '@microsoft/fast-element';
import {
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentForegroundCutRestBehavior,
    ButtonStyles as baseStyles,
    neutralFillStealthRestBehavior,
    neutralFocusBehavior,
    neutralFocusInnerAccentBehavior,
    neutralForegroundRestBehavior,
    neutralOutlineFocusBehavior
} from '@microsoft/fast-components';
import { forcedColorsStylesheetBehavior, focusVisible, display } from '@microsoft/fast-foundation';

export const styles = css`
    ${baseStyles}
    :host {
        --neutral-fill-rest: #1abc9c;
        --neutral-foreground-rest: #1a1a1a;
        --neutral-fill-hover: #22deb9;
        --neutral-fill-active: #1abc9c;
        --type-ramp-base-font-size: 14px;

        i {
            margin-right: 8px;
        }
    }
    :host(.secondary) {
        --neutral-fill-rest: #1a1a1a;
        --neutral-foreground-rest: #ffffff;
        --neutral-fill-hover: #0d0000;
        --neutral-fill-active: #1a0000;
    }
`;
