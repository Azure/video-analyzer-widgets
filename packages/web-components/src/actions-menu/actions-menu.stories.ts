import { ActionsMenuComponent } from '.';
import { AvaDesignSystemProvider } from '../../../styles';
import { MORE_SVG_PATH } from '../../../styles/svg/svg-path';
import { IAction } from './actions-menu.definitions';

// Prevent tree-shaking
AvaDesignSystemProvider;
ActionsMenuComponent;

interface ITemplate {
    darkTheme?: boolean;
    opened?: boolean;
}

const ActionsMenuComponentTemplate = (data: ITemplate) => {
    const designSystem = document.createElement('ava-design-system-provider');
    designSystem.setAttribute('use-defaults', '');
    designSystem.style.height = '400px';
    (designSystem as AvaDesignSystemProvider).theme = (data?.darkTheme && 'dark') || '';
    const actionsMenu = document.createElement('media-actions-menu') as ActionsMenuComponent;

    actionsMenu.actions = actions;
    actionsMenu.opened = data.opened || false;
    designSystem.appendChild(actionsMenu);
    return designSystem;
};

export const ActionsMenu = (args: ITemplate) => ActionsMenuComponentTemplate(args);

const actions: IAction[] = [
    {
        label: 'Rename',
        svgPath: MORE_SVG_PATH
    },
    {
        label: 'Delete',
        svgPath: MORE_SVG_PATH
    }
];

export default {
    title: 'Actions Menu Component',
    argTypes: {
        darkTheme: { control: 'boolean', defaultValue: true },
        opened: { control: 'boolean', defaultValue: false }
    }
};
