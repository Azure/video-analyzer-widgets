import { PlayerComponent } from '.';
import { AvaDesignSystemProvider } from '../../../styles';
interface ITemplate {
    width: string;
    height: string;
}

// Prevent tree-shaking
AvaDesignSystemProvider;
PlayerComponent;

const PlayerComponentTemplate = (data: ITemplate) => {
    const designSystem = document.createElement('ava-design-system-provider') as AvaDesignSystemProvider;
    const btn = document.createElement('player-component') as PlayerComponent;
    designSystem.appendChild(btn);
    return designSystem;
};

export const Example = (args: ITemplate) => PlayerComponentTemplate(args);

export default {
    title: 'player Component'
};
