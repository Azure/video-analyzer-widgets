import { PolygonDrawerComponent } from '.';
import { Localization } from './../../../common/services/localization/localization.class';

interface ITemplate {
    borderColor: string;
    fillColor: string;
}

// Prevent tree-shaking
PolygonDrawerComponent;

const PolygonDrawerComponentTemplate = (data: ITemplate) => {
    const wrapperElement = document.createElement('div');
    wrapperElement.style.height = '300px';
    wrapperElement.style.width = '400px';
    wrapperElement.style.border = '1px solid black';
    const polygonDrawer = document.createElement('media-polygon-drawer') as PolygonDrawerComponent;
    if (data.borderColor) {
        polygonDrawer.borderColor = data.borderColor;
        polygonDrawer.fillColor = data.fillColor;
    }
    wrapperElement.appendChild(polygonDrawer);
    return wrapperElement;
};

export const polygonDrawer = (args) => PolygonDrawerComponentTemplate(args);

export default {
    title: Localization.dictionary.POLYGON_DRAWER_ComponentTitle,
    argTypes: {
        borderColor: { control: 'text' },
        fillColor: { control: 'text' }
    }
};