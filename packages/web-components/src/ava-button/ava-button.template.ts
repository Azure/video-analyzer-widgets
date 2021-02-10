import { html } from '@microsoft/fast-element';
import { AVAButton } from '.';
import { ButtonTemplate as baseTemplate } from '@microsoft/fast-foundation';

/**
 * The template for the example component.
 * @public
 */
export const template = html<AVAButton>`
    <template>
        ${baseTemplate}
    </template>
`;
