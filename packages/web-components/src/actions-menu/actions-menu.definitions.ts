export interface IAction {
    label?: string;
    svgPath?: string;
    disabled?: boolean;
    type?: UIActionTypeOptions;
    edit?: boolean;
}

export enum UIActionType {
    RENAME = 'RENAME',
    DELETE = 'DELETE'
}

export type UIActionTypeOptions = UIActionType;
