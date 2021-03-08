# Appearances Line Component

`appearances-line-component` is an component implementation of a [Fast element](https://www.fast.design/).

The component get config input that contains:

```javascript
{
"data": {
  "appearances": // list of appearances
  [{
    "startSeconds": number;
    "endSeconds": number;
    "color"?: string; // * to customize colors
  }];
  "duration": number; // total duration for the timeline
},
"displayOptions": {
  "height": number;
  "barHeight"?: number;
  "tooltipHeight"?: number;
  "top"?: number;
  "renderTooltip"?: boolean;
  "renderProgress"?: boolean;
},
"timeSmoothing"?: number // time in seconds to merge near appearances
}
```

-   To customize colors you can change 5 css variables:
    -   --appearances-progress-color: progress line color;
    -   --appearances-line-bg: appearance line background color;
    -   --appearances-color: the appearance fill color;
    -   --appearances-tooltip: the tooltip fill color;
    -   --appearances-tooltip-text: the tooltip text color on appearance;

## Please see examples:

-   [Example 1](./examples/example.html)
-   [Example 2](./examples/example2.html)
