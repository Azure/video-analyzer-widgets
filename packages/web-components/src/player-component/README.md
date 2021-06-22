# Player Web Component

`media-player` is an implementation of a [Fast element](https://www.fast.design/).

This component is used for the main player page. It can be used to play back live or pre-recorded (video-on-demand or VoD) content from an Azure Video Analyzer (AVA) video resource. It takes as input the name of the AVA video resource, as well as endpoints for accessing the content. The component determines how much recorded media is available (hours, days, weeks, months, or years). It then uses the most recent set of available media (in a 24 hour window) to render the player timeline, and uses the days/weeks/months/years to populate the [date-picker](./date-picker/README.md) component.

The config input contains:

```javascript
{
  "vodStream": string; // VoD stream endpoint
  "liveStream": string; // live stream endpoint
  "videoName": string; // name of the AVA video resource
}

```

## Please see examples:

-   [Example](./examples/example.html)
