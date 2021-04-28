
export interface IPoint {
    x: number;
    y: number;
    cursor?: number;
}

export enum DrawerEvents {
    COMPLETE = 'DRAWER_ON_COMPLETE'
}

export enum CursorTypes {
    POINTER = 'pointer',
    CROSSHAIR = 'crosshair'
}
