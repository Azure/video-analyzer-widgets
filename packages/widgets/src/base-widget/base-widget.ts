import { attr, FASTElement } from '@microsoft/fast-element';
import { IWidgetBaseConfig } from '../definitions/base-widget-config.definitions';

export class BaseWidget extends FASTElement {
    @attr public config: IWidgetBaseConfig;
    @attr public width: string;
    @attr public height: string;

    public constructor(config?: IWidgetBaseConfig) {
        super();
        if (config) {
            this.config = config;
        }
        this.width = config?.width || '';
        this.height = config?.height || '';

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
