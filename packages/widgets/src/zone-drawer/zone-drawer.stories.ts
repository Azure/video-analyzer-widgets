import { FASTButton, FASTMenu, FASTMenuItem } from '@microsoft/fast-components';
import { ZoneDrawerWidget } from '.';
import { AvaDesignSystemProvider } from '../../../styles';
import { ZonesViewComponent, LineDrawerComponent, LayerLabelComponent } from '../../../web-components/src';
import { PolygonDrawerComponent } from '../../../web-components/src/polygon-drawer/polygon-drawer.component';

interface ITemplate {
    darkTheme?: boolean;
    width?: number;
    height?: number;
}

// Prevent tree-shaking
ZoneDrawerWidget;
AvaDesignSystemProvider;
FASTButton;
ZonesViewComponent;
LineDrawerComponent;
PolygonDrawerComponent;
LayerLabelComponent;
FASTMenu;
FASTMenuItem;

const ZoneDrawerWidgetTemplate = (data: ITemplate) => {
    const designSystem = document.createElement('ava-design-system-provider') as AvaDesignSystemProvider;
    const zonesDraw = document.createElement('zone-draw-widget') as ZoneDrawerWidget;

    designSystem.theme = data.darkTheme ? 'dark' : '';
    designSystem.appendChild(zonesDraw);
    return designSystem;
};

export const ZoneDraw = (args: ITemplate) => ZoneDrawerWidgetTemplate(args);

export default {
    title: 'Zone Draw Widget',
    argTypes: {
        darkTheme: { control: 'boolean', defaultValue: true }
    }
};
