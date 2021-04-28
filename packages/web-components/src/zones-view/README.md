# Zones View Component

`media-zones-view` is an implementation of a [Fast element](https://www.fast.design/).

The component showing lines and polygons over canvas element.
@Input: zone:IZone[] - a list reflects existing zones. Can be optional

```typescript
export interface IPoint {
    x: number;
    y: number;
    cursor?: number;
}

export interface IZone {
    id?: string;
    name?: string;
    color: string;
    points: IPoint[];
}
```

## Please see examples:

-   [Example](./examples/example.html)
