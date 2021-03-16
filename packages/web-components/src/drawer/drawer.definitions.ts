export interface IPoint {
    x: number;
    y: number;
}

// The object type when draw is completed
export interface IDrawPoint {
    end: IPoint;
    start: IPoint;
}
