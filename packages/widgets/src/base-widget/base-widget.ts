import { attr, FASTElement } from '@microsoft/fast-element';
import { IWidgetBaseConfig } from '../definitions/base-widget-config.definitions';

export abstract class BaseWidget extends FASTElement {
    @attr public config: IWidgetBaseConfig;
    @attr public width: string;
    @attr public height: string;

    public constructor(config: IWidgetBaseConfig) {
        super();
        this.config = config;
        this.width = config.width || '';
        this.height = config.height || '';

        if (this.config) {
            this.init();
        }
    }

    public configure(config: IWidgetBaseConfig) {
        this.config = config;
        this.init();
    }

    public abstract render(): void;
    protected abstract init(): void;
}
