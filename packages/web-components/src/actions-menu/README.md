# Actions Menu Component

`media-actions-menu` is an implementation of a [Fast element](https://www.fast.design/).

The component for showing actions menu with a list of IAction[] inputs, where each input is:

```ts
export interface IAction {
    label?: string;
    svgPath?: string;
    disabled?: boolean;
    type?: UIActionType;
}
```

-   To customize colors you can change css variables:
    -   --actions-menu-bg: the label background color.
    -   --actions-menu-color: the text color.

## Please see examples:

-   [Example](./examples/example.html)
