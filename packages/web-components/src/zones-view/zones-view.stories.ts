import { ZonesViewComponent } from '.';
import { AvaDesignSystemProvider } from '../../../styles';
import { IZone } from '../../../widgets/src/zone-drawer/zone-drawer.definitions';

interface ITemplate {
    darkTheme?: boolean;
    width?: number;
    height?: number;
}

// Prevent tree-shaking
ZonesViewComponent;
AvaDesignSystemProvider;

const zones: IZone[] = [
    {
        points: [
            {
                x: 0,
                y: 0
            },
            {
                x: 0.5,
                y: 0.5
            }
        ],
        color: '#1ABC9C'
    },
    {
        points: [
            {
                x: 0.9,
                y: 0.1
            },
            {
                x: 0.7,
                y: 0.8
            }
        ],
        color: '#DB4646'
    },
    {
        points: [
            {
                x: 0.8,
                y: 0.1
            },
            {
                x: 0.9,
                y: 0.8
            },
            {
                x: 0.5,
                y: 0.7
            }
        ],
        color: '#A6C102'
    },
    {
        points: [
            {
                x: 0.3,
                y: 0.1
            },
            {
                x: 0.3,
                y: 0.8
            }
        ],
        color: '#F2880C'
    }
];

const ZonesViewComponentTemplate = (data: ITemplate) => {
    const designSystem = document.createElement('ava-design-system-provider') as AvaDesignSystemProvider;
    const zonesView = document.createElement('media-zones-view') as ZonesViewComponent;

    designSystem.theme = data.darkTheme ? 'dark' : '';
    designSystem.style.width = `${data.width}px`;
    designSystem.style.height = `${data.height}px`;

    zonesView.zones = zones;
    designSystem.appendChild(zonesView);
    return designSystem;
};

export const ZonesView = (args: ITemplate) => ZonesViewComponentTemplate(args);

export default {
    title: 'Zones View Component',
    argTypes: {
        darkTheme: { control: 'boolean', defaultValue: true },
        width: { control: 'number', defaultValue: 400 },
        height: { control: 'number', defaultValue: 400 }
    }
};
