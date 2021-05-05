
import { LineDrawerComponent } from './line-drawer.component';

interface ITemplate {
    borderColor: string;
}

// Prevent tree-shaking
LineDrawerComponent;

const LineDrawerComponentTemplate = (data: ITemplate) => {
    const lineDrawer = document.createElement('media-line-drawer') as LineDrawerComponent;
    if (data.borderColor) {
        lineDrawer.borderColor = data.borderColor;
    }
    return lineDrawer;
};

export const lineDrawer = (args) => LineDrawerComponentTemplate(args);

export default {
    title: 'Line Drawer Component',
    argTypes: {
        borderColor: { control: 'string' }
    }
};
