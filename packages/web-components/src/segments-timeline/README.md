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
"timeSmoothing"?: number // When showing segments on a timescale that is too large – for example on a 24 hour timeline, it is not possible to show distinct segments when they are separated by too small a distance, say 1.3 seconds. By setting timeSmoothing to 1.3, you can combine segments when they are separated by less than this distance.
}
```

-   To customize colors you can change 5 css variables:
    -   --segments-progress-color: progress line color;
    -   --segments-line-bg: appearance line background color;
    -   --segments-color: the appearance fill color;
    -   --segments-tooltip: the tooltip fill color;
    -   --segments-tooltip-text: the tooltip text color on appearance;

## Please see examples:

-   [Example](./examples/example.html)
