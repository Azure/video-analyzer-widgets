export interface IAction {
    label?: string;
    svgPath?: string;
    disabled?: boolean;
    type?: UIActionType;
    edit?: boolean;
}

export enum UIActionType {
    RENAME = 'RENAME',
    DELETE = 'DELETE'
}

export enum ActionsMenuEvents {
    ActionClicked = 'ACTIONS_MENU_ACTION_CLICKED'
}
