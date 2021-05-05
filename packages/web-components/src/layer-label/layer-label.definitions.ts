import { IAction } from '../actions-menu/actions-menu.definitions';

export type ILayerLabelType = 'area' | 'line';

export enum LayerLabelMode {
    Compact = 'compact',
    Expanded = 'expanded',
    Actions = 'actions'
}

export interface ILayerLabelConfig {
    id: string;
    label: string;
    mode: LayerLabelMode;
    labelPrefix?: string;
    color?: string;
    actions?: IAction[];
}

export interface ILayerLabelOutputEvent {
    id: string;
    name: string;
}

export enum LayerLabelEvents {
    labelActionClicked = 'LAYER_LABEL_ACTION_CLICKED',
    labelTextChanged = 'LAYER_LABEL_TEXT_CHANGED'
}
