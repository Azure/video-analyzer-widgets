import { AvaDesignSystemProvider } from '../../../styles';
import { DELETE_SVG_PATH, MORE_SVG_PATH, RENAME_SVG_PATH } from '../../../styles/svg/svg.shapes';
import { DrawingColors } from '../../../styles/system-providers/ava-design-system-provider.definitions';
import { LayerLabelComponent } from './layer-label.component';
import { LayerLabelMode } from './layer-label.definitions';
import { Localization } from './../../../common/services/localization/localization.class';

// Prevent tree-shaking
AvaDesignSystemProvider;
LayerLabelComponent;

interface ITemplate {
    darkTheme?: boolean;
    labelPrefix?: string;
    label?: string;
    color?: DrawingColors;
    mode?: LayerLabelMode;
}

const LayerLabelComponentTemplate = (data: ITemplate) => {
    const designSystem = document.createElement('ava-design-system-provider');
    designSystem.setAttribute('use-defaults', '');
    designSystem.style.height = '400px';
    (designSystem as AvaDesignSystemProvider).theme = (data?.darkTheme && 'dark') || '';
    const layerLabel = document.createElement('media-layer-label') as LayerLabelComponent;
    const config = {
        id: '',
        label: data.label || '',
        mode: data.mode || LayerLabelMode.Compact,
        labelPrefix: data.labelPrefix || '',
        color: data.color || DrawingColors.Lime,
        actions: [
            {
                label: 'Rename',
                svgPath: RENAME_SVG_PATH
            },
            {
                label: 'Delete',
                svgPath: DELETE_SVG_PATH
            }
        ]
    };

    layerLabel.config = config;
    designSystem.appendChild(layerLabel);
    return designSystem;
};

export const LayerLabel = (args: ITemplate) => LayerLabelComponentTemplate(args);

export default {
    title: Localization.dictionary.LAYER_LABEL_ComponentTitle,
    argTypes: {
        darkTheme: { control: 'boolean', defaultValue: true },
        label: { control: 'text' },
        labelPrefix: { control: 'text' },
        color: {
            control: {
                type: 'select',
                options: ['red', 'light-blue', 'yellow', 'magenta', 'teal', 'purple', 'lime', 'blue', 'green', 'orange']
            }
        },
        mode: {
            control: {
                type: 'select',
                options: ['compact', 'expanded', 'actions']
            }
        }
    }
};
