import { html } from '@microsoft/fast-element';
import { ExampleComponent } from '.';

/**
 * The template for the example component.
 * @public
 */
export const template = html<ExampleComponent>`
    <template>
        <div class="${(x) => (x.text ? 'has-text' : '')}">
            <span>${(x) => x.text}</span>
        </div>
    </template>
`;
