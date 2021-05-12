# Player Web Component

`rvx-player` is an implementation of a [Fast element](https://www.fast.design/).

The component is showing live and VOD mode stream and fetching the available media segments and dates. The available segments reflects on the timeline and the dates on the date picker.

config input contains:

```javascript
{
  "liveStream": string; // vod stream endpoint
  "liveStream": string; // live stream endpoint
  "cameraName": string; // camera name
}
```

## Please see examples:

-   [Example](./examples/example.html)
