import { LineDrawerComponent } from '.';
interface ITemplate {
    elemId: string;
}

// Prevent tree-shaking
LineDrawerComponent;

const LineDrawerComponentTemplate = (data: ITemplate) => {
    const storybook = document.createElement('line-drawer-component') as LineDrawerComponent;
    return storybook;
};

export const lineDrawer = (args) => LineDrawerComponentTemplate(args);

export default {
    title: 'Line Drawer Component',
    argTypes: {
        elemId: { control: 'string' }
    }
};
