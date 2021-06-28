# Timeline Component

`media-timeline` is an implementation of a [Fast element](https://www.fast.design/).

The component showing media segments with time ruler for 24 hours.
config input contains:

```javascript
{
  "segments": // list of segments
  [{
    "startSeconds": number; // Between zero and 24*3600
    "endSeconds": number; //  Between zero and 24*3600 (endSeconds > startSeconds)
    "color"?: string; // customize segment colors
  }];
  "date": Date; // start date for the timeline (Date in UTC)
  "enableZoom": boolean; // enable zoom option on timeline
}
```

-   To customize colors you can change SegmentsTimelineComponent & TimeRulerComponent css variables.

## Please see examples:

-   [Example](./examples/example.html)
