
import {
    IDictionary, DEFAULT_LOCALE_LANGUAGE,
    SupportedLocaleLanguages, SUPPORTED_LOCALES, IComponentsType
} from './localization.definitions';

export class Localization {

    private static _dictionary: IDictionary = {};
    private static _localizations: Map<string, IDictionary> = new Map<string, IDictionary>();
    private static _locales: string[] = SUPPORTED_LOCALES;
    private static _currentLocale: string = DEFAULT_LOCALE_LANGUAGE;

    /* 
    * Load the resources and set the dictionary with a specific locale.
    * If locale is null, the default locale is 'en'.
    */
    public static load(locale?: string, componentTypes: IComponentsType[] = ['common']) {
        try {
            for (const locale of this._locales) {
                let dict: IDictionary = {};
                for (const compType of componentTypes) {
                    const jsonFile = this.getJsonFile(compType, locale);
                    if (jsonFile && Object.keys(jsonFile).length !== 0) {
                        for (var val in jsonFile) {
                            dict[val] = jsonFile[val];//.push({value: jsonFile[value]});
                        }
                    }
                }
                // After import the fileJson add the content to the _localizations map
                this._localizations.set(locale, dict);
            }

        } catch (error) {
            console.log(error);
        }

        this.changeLocale(locale);
    }

    public static changeLocale(locale: string) {
        this._currentLocale = this.getMappedLocale(locale);
        this._dictionary = this._localizations.get(this._currentLocale);
    }

    public static translate(keys: string[]) {
        let resources: IDictionary = {};
        for (const key of keys) {
            resources[key] = this.resolve(key);
        }
        return resources;
    }

    public static resolve(key: string): string {
        return this._dictionary[key] || '';
    }

    public static getJsonFile(compType: string, locale: string) {
        return require(`../../../../resources/locales/${compType}/${locale}.json`);
    }

    public static get dictionary() {
        return this._dictionary;
    }

    private static getMappedLocale(locale: string) {
        return locale && SupportedLocaleLanguages[locale.toLowerCase()] || DEFAULT_LOCALE_LANGUAGE;
    }
}
