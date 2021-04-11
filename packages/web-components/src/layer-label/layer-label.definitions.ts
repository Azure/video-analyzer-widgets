import { DrawingColors } from '../../../styles/system-providers/ava-design-system-provider.definitions';
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
