import { PlayerComponent } from '.';
import { AvaDesignSystemProvider } from '../../../styles';
import { Localization } from './../../../common/services/localization/localization.class';
interface ITemplate {
    width: string;
    height: string;
}

// Prevent tree-shaking
AvaDesignSystemProvider;
PlayerComponent;

const PlayerComponentTemplate = (data: ITemplate) => {
    const designSystem = document.createElement('ava-design-system-provider') as AvaDesignSystemProvider;
    const btn = document.createElement('rvx-player') as PlayerComponent;
    if (data.height) {
        btn.height = data.height;
    }

    if (data.width) {
        btn.width = data.width;
    }
    designSystem.appendChild(btn);
    return designSystem;
};

export const Example = (args: ITemplate) => PlayerComponentTemplate(args);

export default {
    title: Localization.dictionary.PLAYER_ComponentTitle,
    argTypes: {
        width: { control: 'text' },
        height: { control: 'text' }
    }
};
