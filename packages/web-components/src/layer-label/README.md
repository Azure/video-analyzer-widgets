# Layer Label Component

`media-layer-label` is an implementation of a [Fast element](https://www.fast.design/).

The component showing layer label with config input.
There are 3 modes for the layer label:

```ts
export enum LayerLabelMode {
    Compact = 'compact',
    Expanded = 'expanded',
    Actions = 'actions'
}
```

config input contains:

```ts
export interface ILayerLabelConfig {
    label: string;
    mode: LayerLabelMode;
    labelPrefix?: string;
    color?: DrawingColors;
    actions?: IAction[];
}
```

-   To customize colors you can change css variables:
    -   --layer-label-bg: the label background color.
    -   --layer-label-color: the text color.

## Please see examples:

-   [Example](./examples/example.html)
