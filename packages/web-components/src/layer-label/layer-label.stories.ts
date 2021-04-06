import { AvaDesignSystemProvider } from '../../../styles';
import { MORE_SVG_PATH } from '../../../styles/svg/svg-path';
import { LayerLabelComponent } from './layer-label.component';
import { LayerLabelColor, LayerLabelMode } from './layer-label.definitions';

// Prevent tree-shaking
AvaDesignSystemProvider;
LayerLabelComponent;

interface ITemplate {
    darkTheme?: boolean;
    labelPrefix?: string;
    label?: string;
    color?: LayerLabelColor;
    mode?: LayerLabelMode;
}

const LayerLabelComponentTemplate = (data: ITemplate) => {
    const designSystem = document.createElement('ava-design-system-provider');
    designSystem.setAttribute('use-defaults', '');
    designSystem.style.height = '400px';
    (designSystem as AvaDesignSystemProvider).theme = (data?.darkTheme && 'dark') || '';
    const layerLabel = document.createElement('media-layer-label') as LayerLabelComponent;
    const config = {
        label: data.label || '',
        mode: data.mode || LayerLabelMode.Compact,
        labelPrefix: data.labelPrefix || '',
        color: data.color || LayerLabelColor.Lime,
        actions: [
            {
                label: 'Rename',
                svgPath: MORE_SVG_PATH
            },
            {
                label: 'Delete',
                svgPath: MORE_SVG_PATH
            }
        ]
    };

    layerLabel.config = config;
    designSystem.appendChild(layerLabel);
    return designSystem;
};

export const LayerLabel = (args: ITemplate) => LayerLabelComponentTemplate(args);

export default {
    title: 'Layer Label Component',
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
