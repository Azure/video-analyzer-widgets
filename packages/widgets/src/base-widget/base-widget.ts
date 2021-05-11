import { attr, FASTElement } from '@microsoft/fast-element';
import { closestElement } from '../../../common/utils/elements';
import { AvaDesignSystemProvider } from '../../../styles/system-providers';
import { Logger } from '../common/logger';
import { IWidgetBaseConfig } from '../definitions/base-widget-config.definitions';

export class BaseWidget extends FASTElement {
    @attr public _config: IWidgetBaseConfig;
    @attr public width: string;
    @attr public height: string;

    public constructor(config?: IWidgetBaseConfig) {
        super();
        if (config) {
            this._config = config;
        }
        this.width = config?.width || '';
        this.height = config?.height || '';

        if (this._config) {
            this.init();
        }

        setTimeout(() => {
            this.validateOrAddDesignSystem();
        });
    }

    public configure(config: IWidgetBaseConfig) {
        this._config = config;
        Logger.debugMode = !!this._config?.debug;
        this.init();
    }

    public render(): void {}

    protected init(): void {}

    private validateOrAddDesignSystem() {
        let designSystem = closestElement('ava-design-system-provider', this.$fastController.element);
        if (designSystem) {
            Logger.log('Already have design system.');
        } else {
            // create design system element
            designSystem = document.createElement('ava-design-system-provider') as AvaDesignSystemProvider;

            if (designSystem.$fastController) {
                // set part 'style-control' to overwrite design system css
                designSystem.$fastController.element.setAttribute('part', 'style-control');
                // set child elements as child of the design system
                const documentFragment = document.createDocumentFragment();
                Array.from(this.shadowRoot.children).forEach((c) => documentFragment.appendChild(c));
                designSystem.$fastController.element.appendChild(documentFragment);
                // set the design system as child (instead of the children elements)
                this.shadowRoot.appendChild(designSystem);
            } else {
                Logger.log('Need to import AvaDesignSystemProvider');
            }
        }
    }
}
