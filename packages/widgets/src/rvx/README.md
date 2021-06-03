# Player widget Component

`ava-player` is a web component implementation of a [Fast element](https://www.fast.design/).
The player widget can be used to play back video that has been stored in the Video Analyzer service.

The class inherits from BaseWidget which inherit from FastElement.

Inputs:
config: IAvaPlayerConfig - the user can send a predefined zone which will be displayed when the widgets is loaded.

## IAvaPlayerConfig interface:

Extends IWidgetBaseConfig interface.
| Name | Type | Description |
| ------ | ---------------- | ---------------------------------- |
| videoName | string | Embedded video name |
| clientApiEndpointUrl | string |AVA API endpoint |
| token | string |AVA API token |
| playerControllers | ControlPanelElements[] |AVA player controllers - used to adjust ava player controllers |

## Code examples:

-   [Example 1](../examples/rvx-widget.html)
