import { PlayerComponent } from '.';
interface ITemplate {
    width: string;
    height: string;
}

// Prevent tree-shaking
PlayerComponent;

const PlayerComponentTemplate = (data: ITemplate) => {
    const btn = document.createElement('rvx-player') as PlayerComponent;
    if (data.height) {
        btn.height = data.height;
    }

    if (data.width) {
        btn.width = data.width;
    }
    return btn;
};

export const Example = (args: ITemplate) => PlayerComponentTemplate(args);

export default {
    title: 'player Component',
    argTypes: {
        width: { control: 'text' },
        height: { control: 'text' }
    }
};
