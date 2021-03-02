# Time Line Component

`time-line-component` is an component implementation of a [Fast element](https://www.fast.design/).

The component get config input that contains:

```javascript
{
"data": {
  "appearances": // list of appearances
  [{
    "startSeconds": number;
    "endSeconds": number;
    "className"?: string; // * to customize colors
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
}
}
```

-   Customize class name will add to the appearance 4 css variables that can be overwrite:
    -   --{className}-color
    -   --{className}-text
    -   --{className}-tooltip-text
    -   --{className}-tooltip-bg

## Please see examples:

-   [Example 1](./examples/example.html)
-   [Example 2](./examples/example2.html)
