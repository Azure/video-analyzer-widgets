# Player widget Component

`ava-player` is a web component implementation of a [Fast element](https://www.fast.design/).
The player widget can be used to play back video that has been recorded to your Azure Video Analyzer (AVA) account).

The class inherits from BaseWidget which inherits from FastElement.

Inputs:
config: IAvaPlayerConfig - the user can send a predefined zone which will be displayed when the widget is loaded.

## IAvaPlayerConfig interface:

Extends IWidgetBaseConfig interface.
| Name | Type | Description |
| ------ | ---------------- | ---------------------------------- |
| videoName | string | Name of the AVA video resource |
| clientApiEndpointUrl | string |AVA Client API endpoint |
| token | string |A JWT token for accessing the Client APIs |
| playerControllers | ControlPanelElements[] |AVA player controllers - used to adjust AVA player controls |

## Code examples:

-   [Example 1](../examples/rvx-widget.html)
