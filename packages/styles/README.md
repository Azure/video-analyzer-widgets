# AVA Styles

Folder that contains all Azure Video Analyzer (AVA) styles

## Fonts

    - Custom Segoe UI

## AVA Design System provider:

    Custom design system providers (more info on design systems: https://www.fast.design/docs/design-systems/overview/)
    Includes AVA design system provider.

-   Creating using HTML:

    ```html
    <ava-design-system-provider use-defaults>
        <!-- Here use can use all AVA widgets, and you will get the default AVA theme -->
    </ava-design-system-provider>
    ```

-   Dark Mode:

    ```html
    <ava-design-system-provider theme="dark" use-defaults>
        <!-- Here use can use all AVA widgets, and you will get the default AVA theme -->
    </ava-design-system-provider>
    ```

### Customize Colors

    Overwrite the following css Variables to create custom UI.

-   Css Variables:

    ```css
    :ava-design-system-provider {
        /* Segments Line */
        --segments-progress-color
        --segments-line-bg
        --segments-color
        --segments-tooltip
        --segments-tooltip-text
        --segments-active-color

        /* Time Ruler */
        --ruler-small-scale-color
        --ruler-text-color
        --ruler-time-color

        /* Date picker */
        --date-picker-holder-bg
        --date-picker-button-bg
        --date-picker-text-color
        --date-picker-tittle-color
        --date-picker-today-bg
        --date-picker-today-color
        --date-picker-selected-hover
        --date-picker-selected-press
        --date-picker-disabled-color
        --date-picker-divider-color
        --date-picker-holder-box-shadow-1
        --date-picker-holder-box-shadow-2

        /* Layer Label */
        --layer-label-bg
        --layer-label-color

        /* Actions Menu */
        --actions-menu-bg
        --actions-menu-color

        /* Drawer Canvas */
        --drawer-line-color
        --drawer-fill-color

        /* Zone Draw */
        --zone-draw-color
        --zone-draw-bg
        --zone-draw-selected-btn

        /* Player widget */
        --player-background
    }
    ```

    Example:

    ```css
    ava-design-system-provider {
        --segments-progress-color: red;
    }
    ```

## Themes

    Support 2 themes colors;
        - Default (light)
        - Dark

## Examples:

    for 3 design system providers:
        - Fluent
        - Fast
        - AVA
