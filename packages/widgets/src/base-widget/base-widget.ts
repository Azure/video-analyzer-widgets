import { attr, FASTElement } from '@microsoft/fast-element';
import { IWidgetBaseConfig } from '../definitions/base-widget-config.definitions';

export class BaseWidget extends FASTElement {
    @attr public config: IWidgetBaseConfig;
    @attr public width: string;
    @attr public height: string;

    public constructor(config: IWidgetBaseConfig) {
        super();
        this.config = config;
        this.width = config?.width || '100%';
        this.height = config?.height || '100%';

        if (this.config) {
            this.init();
        }
    }

    public configure(config: IWidgetBaseConfig) {
        this.config = config;
        this.init();
    }

    public render(): void {}

    protected init(): void {}
}
