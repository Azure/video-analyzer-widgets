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
        this.width = config?.width || '100%';
        this.height = config?.height || '100%';

        if (this.config) {
            this.init();
        } else {
            // this.config = Object.create(null);
        }
    }

    public configure(config: IWidgetBaseConfig) {
        this.config = config;
        this.init();
    }

    public load(): void {}

    protected init(): void {}
}
