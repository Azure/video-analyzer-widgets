# Editable Text Field Component

`media-editable-text-field` is an implementation of a [Fast element](https://www.fast.design/).

The component for showing a text label with an option to edit the text.
The component has the following inputs:

```ts
export class EditableTextFieldComponent extends FASTElement {
    /**
     * The text field text
     *
     * @public
     * @remarks
     * HTML attribute: text
     */
    @attr public text: string = '';

    /**
     * The text field edit mode (boolean).
     *
     * @public
     * @remarks
     * HTML attribute: editMode
     */

    @attr({ attribute: 'edit-mode', mode: 'boolean' })
    public editMode: boolean = false;
}
```

## Please see examples:

-   [Example](./examples/example.html)
