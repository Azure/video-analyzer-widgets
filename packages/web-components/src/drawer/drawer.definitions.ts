export interface Point {
    x: number;
    y: number;
}

// The object type when draw is completed
export interface IDrawCompleteEvent {
    end: Point;
    start: Point;
}