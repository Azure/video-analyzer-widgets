# Actions Menu Component

`media-actions-menu` is an implementation of a [Fast element](https://www.fast.design/).

The component showing actions menu with IAction[] input.
actions list input contains:

```ts
export interface IAction {
    label?: string;
    svgPath?: string;
    disabled?: boolean;
    type?: UIActionTypeOptions;
}
```

-   To customize colors you can change css variables:
    -   --actions-menu-bg: the label background color.
    -   --actions-menu-color: the text color.

## Please see examples:

-   [Example](./examples/example.html)
