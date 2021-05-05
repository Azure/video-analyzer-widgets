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
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
ZoneDrawerWidget;
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
AvaDesignSystemProvider;
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
FASTButton;
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
ZonesViewComponent;
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
LineDrawerComponent;
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
PolygonDrawerComponent;
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
LayerLabelComponent;
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
FASTMenu;
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
