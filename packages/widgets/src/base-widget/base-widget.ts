import { attr, FASTElement, observable } from '@microsoft/fast-element';
import { IComponentsType, IDictionary } from '../../../common/services/localization/localization.definitions';
import { closestElement } from '../../../common/utils/elements';
import { AvaDesignSystemProvider } from '../../../styles/system-providers';
import { Logger } from '../common/logger';
import { IWidgetBaseConfig } from '../definitions/base-widget-config.definitions';
import { Locale } from '../definitions/locale.definitions';
import { Localization } from './../../../common/services/localization/localization.class';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
Localization;

export class BaseWidget extends FASTElement {
    @attr public _config: IWidgetBaseConfig;
    @attr public width: string;
    @attr public height: string;

    @observable
    public resources: IDictionary = {};

    public constructor(config?: IWidgetBaseConfig) {
        super();
        if (config) {
            this._config = config;
        }

        this.width = config?.width || '100%';
        this.height = config?.height || '100%';
    }

    public configure(config: IWidgetBaseConfig) {
        this._config = config;
    }

    public setDebugMode(state: boolean) {
        if (this._config) {
            this._config.debug = state;
        }
        Logger.debugMode = state;
    }

    public setLocalization(locale: Locale, widgets: IComponentsType[]) {
        if (this._config) {
            this._config.locale = locale;
        } else {
            this._config = {
                locale: locale
            };
        }

        Localization.load(locale, widgets);
        this.resources = Localization.dictionary;
    }

    public load(): void {}

    protected init(): void {}

    protected validateOrAddDesignSystem() {
        let designSystem = closestElement('ava-design-system-provider', this.$fastController.element);
        if (designSystem) {
            Logger.log('Already have design system.');
        } else {
            // create design system element
            designSystem = document.createElement('ava-design-system-provider') as AvaDesignSystemProvider;

            if (designSystem.$fastController) {
                // set part 'style-control' to overwrite design system css
                designSystem.$fastController.element.setAttribute('part', 'style-control');
                designSystem.$fastController.element.setAttribute('theme', 'dark');
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
