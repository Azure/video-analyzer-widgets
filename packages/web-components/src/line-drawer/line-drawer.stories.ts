import { LineDrawerComponent } from '.';

interface ITemplate {
    borderColor: string;
}

// Prevent tree-shaking
LineDrawerComponent;

const LineDrawerComponentTemplate = (data: ITemplate) => {
    const wrapperElement = document.createElement('div');
    wrapperElement.style.height = '300px';
    wrapperElement.style.width = '400px';
    wrapperElement.style.border = '1px solid black';
    const lineDrawer = document.createElement('media-line-drawer') as LineDrawerComponent;
    if (data.borderColor) {
        lineDrawer.borderColor = data.borderColor;
    }
    wrapperElement.appendChild(lineDrawer);
    return wrapperElement;
};

export const lineDrawer = (args) => LineDrawerComponentTemplate(args);

export default {
    title: 'Line Drawer Component',
    argTypes: {
        borderColor: { control: 'text' }
    }
};
