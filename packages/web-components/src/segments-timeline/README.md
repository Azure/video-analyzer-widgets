# Segments Timeline Component

`media-segments-timeline` is an component implementation of a [Fast element](https://www.fast.design/).

The component showing segments on time line depending on the duration.
config input contains:

```javascript
{
"data": {
  "segments": // list of segments
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
"timeSmoothing"?: number // time in seconds to merge near segments
}
```

-   To customize colors you can change 5 css variables:
    -   --segments-progress-color: progress line color;
    -   --segments-line-bg: appearance line background color;
    -   --segments-color: the appearance fill color;
    -   --segments-tooltip: the tooltip fill color;
    -   --segments-tooltip-text: the tooltip text color on appearance;

## Please see examples:

-   [Example 1](./examples/example.html)
