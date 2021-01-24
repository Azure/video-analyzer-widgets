import { html } from '@microsoft/fast-element';
import { ExampleComponent } from '.';

/**
 * The template for the example component.
 * @public
 */
export const template = html<ExampleComponent>`
    <template>
        <div class="${(x) => (x.text?.length > 1 ? 'has-text' : '')}">
            <span>${(x) => x.text}</span>
        </div>
    </template>
`;
