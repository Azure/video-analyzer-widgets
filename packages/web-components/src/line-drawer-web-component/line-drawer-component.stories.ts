import { LineDrawerComponent } from '.';

interface ITemplate {
    borderColor: string;
    canvasWidth: string;
    canvasHeight: string;
}

// Prevent tree-shaking
LineDrawerComponent;

const LineDrawerComponentTemplate = (data: ITemplate) => {
    const lineDrawer = document.createElement('line-drawer-component') as LineDrawerComponent;
    if (data.borderColor) {
        lineDrawer.borderColor = data.borderColor;
    }
    if (data.canvasWidth) {
        lineDrawer.canvasWidth = data.canvasWidth;
    }
    if (data.canvasHeight) {
        lineDrawer.canvasHeight = data.canvasHeight;
    }
    return lineDrawer;
};

export const lineDrawer = (args) => LineDrawerComponentTemplate(args);

export default {
    title: 'Line Drawer Component',
    argTypes: {
        borderColor: { control: 'string' },
        canvasWidth: { control: 'string' },
        canvasHeight: { control: 'string' }
    }
};
