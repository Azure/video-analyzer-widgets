import { IAction } from '../actions-menu/actions-menu.definitions';

export type ILayerLabelType = 'area' | 'line';

export enum LayerLabelMode {
    Compact = 'compact',
    Expanded = 'expanded',
    Actions = 'actions'
}

export enum LayerLabelColor {
    Red = 'red',
    LightBlue = 'light-blue',
    Yellow = 'yellow',
    Magenta = 'magenta',
    Teal = 'teal',
    Purple = 'purple',
    Lime = 'lime',
    Blue = 'blue',
    Green = 'green',
    Orange = 'orange'
}

export interface ILayerLabelConfig {
    label: string;
    mode: LayerLabelMode;
    labelPrefix?: string;
    color?: LayerLabelColor;
    actions?: IAction[];
}
