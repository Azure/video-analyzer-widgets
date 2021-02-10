import { FluentDesignSystemProvider } from '@fluentui/web-components';
import { FASTDesignSystemProvider } from '@microsoft/fast-components';
import { css } from '@microsoft/fast-element';
import { defineDesignSystemProvider, DesignSystemProviderTemplate as template } from '@microsoft/fast-foundation';

@defineDesignSystemProvider({
    name: 'ava-button-primary-design-system-provider',
    template,
    styles: css`
        :host {
            display: inline-block;
            --neutral-fill-rest: #1abc9c;
            --neutral-foreground-rest: #1a1a1a;
            --neutral-fill-hover: #22deb9;
            --neutral-fill-active: #1abc9c;
            --type-ramp-base-font-size: 14px;
        }
    `
})
export class AvaButtonPrimaryDesignSystemProvider extends FluentDesignSystemProvider {}
