# Build intelligent video applications with Azure Video Analyzer (AVA) widgets

In this tutorial you will learn how to use Azure Video Analyzer Player widget within your application.
you'll be editing an existing HTML static website. If you'd like to follow the step-by-step guide, you'll need some tools. Start with a code editor like Visual Studio Code. You'll also need a local development server. A simple way to set one up is to use the Live Server extension for VS Code.

# Suggested pre-reading

-   [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
-   [TypeScript](https://www.typescriptlang.org)

# Prerequisites

Prerequisites for this tutorial are:

-   [NodeJS](https://nodejs.org/en/download/)
-   [Visual Studio Code](https://code.visualstudio.com/) on your development machine.
-   [Azure Subscription](#TBD)
-   [AVA Account setup in Azure](https://review.docs.microsoft.com/en-us/azure/azure-video-analyzer/video-analyzer-docs/overview?branch=release-azure-video-analyzer)

# Concepts

## Web Components

"Web Components" is an umbrella term that refers to a collection of web standards focused on enabling the creation of custom HTML elements. Some of the standards that are under the umbrella include the ability to define new HTML tags, plug into a standard component lifecycle, encapsulate HTML rendering and CSS, parameterize CSS, skin components, and more. Each of these platform features is defined by the W3C and has shipped in every major browser today.

## Web Widget

An (HTML) widget is a visual component that can be embeddable within an HTML page. It uses HTML, CSS and JavaScript in order to render itself on the host page. Widgets let the user to interact with them and enrich the user interface with extended functionality.

[DIAGRAM PLACEHOLDER]

# Setting up your development environment

This guide is assuming you are using Visual Studio Code and have already installed the Live Server extension. On your computer open a terminal and navigate to where you'd like to download the tutorial files. Download the zipped source code from here, or view the source in our GitHub repository.

# Add the Azure Video Analyzer Player Component

the first step is to add the Web Component module. You can use the current published pre-bundled script that contains all the APIs you need, by importing it from the unpkg.com.

Before the end </body> tag, import the module. Make sure you specify that this is a JavaScript module by using type="module".
This will make your browser to import the needed code at runtime.

```html

        ...
        <!-- Add Video Analyzer player web component -->
        <script async type="module" src="https://unpkg.com/@azure/video-analyzer-widgets"></script>

    </body>
</html>
```

Now, you can use it within your application just by adding the `html <ava-player>` tag in your html,
Same as you add native html tag.

```html
 <body>
	<ava-player><ava-player>
  </body>
```

Optionally you can import the package yourself at build time, using `npm`. in order to do that please run

```bash
npm install @azure/video-analyzer-widgets`
```

After you have installed the widgets package you can easily import it within your application code, and start using it

```typescript
import { Player } from '@azure/video-analyzer-widgets';

const avaPlayer = new Player();
document.firstElementChild.appendChild(avaPlayer).

```

Native Javascript is supported as well:

```html
<script>
    (function () {
        // Access global widgets library and create player instance
        const avaPlayer = new ava.widgets.player();

        // Dynamically add the player to the DOM
        document.firstElementChild.appendChild(avaPlayer);
    })();
</script>
```

After you understand how to add the widget code to your application / html page and create a player, now lets implement a real world scenario and make the player connect to Video Analyzer account.

# Configuring the player with your Video Analyzer account

In order to configure the player to play the content that was feed into your Video Analyzer pipeline you will first need to setup Video Analyzer account.
Before you can initialize the player with your Video Analyzer account please complete the following steps:

1. Set up Video Analyzer account
2. Create access policy
3. Generate access token
4. Grab the video you would like to stream with the AVA Player

Once you have all this information, you can configure the player before you load it.
You will have to provide the widget with all required fields:

| Name                 | Type   | Default | Description                                             |
| -------------------- | ------ | ------- | ------------------------------------------------------- |
| token                | string |         | Your AVA trusted access token for the widget            |
| videoName            | string |         | The video name as appears in the video analyzer account |
| clientApiEndpointUrl | string |         | AVA Client API endpoint                                 |

```typescript
const avaPlayer = new Player();
// Configure widget with AVA API configuration
avaPlayer.configure({
    token: '<AVA-API-JWT-TOKEN>',
    accountId: '<GUID-ACCOUNT-ID>',
    longRegionCode: '<REGION-CODE>',
    videoName: '<VIDEO-NAME-FROM-AVA-ACCOUNT>’
});
```

The Player instance will return a custom `HTMLElement`.
Next, append the player element to your relevant DOM position, and call load.

```typescript
document.firstElementChild.appendChild(avaPlayer);
avaPlayer.load();
```

The player widget will be rendered on the page.
for debugging we recommend to check devtools (F12) for console errors.

# Player Authorization

In order to make the player communicating with Video Analyzer API, and get the video playback authorization token you have to provide it with trusted access token (JWT token) that you need to generate as you can see above in config phase.

Once you have that access token, you need to add that to the player configuration before calling the `load` function.

## Refreshing the access token

You have two ways of refreshing the access token (after you have generated new one)

1. Actively calling widget method `setAccessToken`
    ```typescript
    avaPlayer.setAccessToken('<NEW-ACCESS-TOKEN>');
    ```
2. Acting apon `TOKEN_EXPIRED` event by listening to this event
    ```typescript
    avaPlayer.addEventListener(PlayerEvents.TOKEN_EXPIRED, () => {
        avaPlayer.setAccessToken('<YOUR-NEW-TOKEN>');
    });
    ```
    - The `TOKEN_EXPIRED` event will dispatched 5 seconds before the token is going to be expired.
    - We recommend to set the event listener before calling the `load` function.

One the player gets the access token, it uses it in order to get the playback authorization token.
for learning more about the widget API please [read more](https://github.com/video-analyzer/widgets) here.

# Using Player widget in React application

Please refer to this [link](https://github.com/benbakhar/ava-demo)

# Demo

You test the player widget in the [demo page](https://aka.ms/ava-widgets-demo)

# Bundling and packaging - TBD
