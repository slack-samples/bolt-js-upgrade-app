# Upgrade App Sample

## Background

Slack does not currently provide a way for users to know that an app has an update available. While admins can check an app's directory listing to see if new scopes are available for proactive approval, there isn't an obvious or scalable way for an admin to know when to check this page nor how to initiate the update if found.

The duty falls to app developers to notify admins and users in Slack when such an update is available. This sample app combines several of those techniques in a single app so that devs can learn where/how to creatively alert users when updates are available to their workspace.

## Installation

#### Create a Slack App
1. Open [https://api.slack.com/apps/new](https://api.slack.com/apps/new) and choose "From an app manifest"
2. Choose the workspace you want to install the application to
3. Copy the contents of [manifest.json](./manifest.json) into the text box that says `*Paste your manifest code here*` (within the JSON tab) and click *Next*
4. Review the configuration and click *Create*

#### Environment Variables
Before you can run the app, you'll need to store some environment variables.

1. Copy `.env.sample` to `.env`
2. Open your apps configuration page from [this list](https://api.slack.com/apps), click *Basic Information* from the left hand menu, and copy the values for the `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, `SLACK_SIGNING_SECRET` into your `.env` file.
3. Follow the steps in the *App-Level Tokens* section to create an app-level token with the `connections:write` scope. Copy that token into your `.env` as `SLACK_APP_TOKEN`.
4. Set your `SLACK_REDIRECT_URI` to `https://<site>.ngrok.io/slack/oauth_redirect` if using ngrok ([see guide below](#oauth)) or to the public endpoint of your choice. The default Bolt redirect path `/slack/oauth_redirect` should still be used even if not using ngrok.
5. Set your `SLACK_START_SCOPES` to `chat:write,commands` and your `SLACK_UPGRADE_SCOPES` to `chat:write,commands,app_mentions:read,reactions:write`. The starting scopes are used in `manifest.json` and the upgrade scopes are used in `manifest-upgrade.json` once you decide to upgrade the app.
6. Finally, set `SLACK_PROMPT_INSTALL` to `false` to start.

#### Install Dependencies

`npm install`

#### Run Bolt Server

`npm start` or `npm start dev`

## Project Structure

### `manifest.json`

`manifest.json` is a configuration for Slack apps. With a manifest, you can create an app with a pre-defined configuration, or adjust the configuration of an existing app. There are two manifest files in this project. This default manifest represents the basic/initial configuration of your app.

### `manifest-upgrade.json`

`manifest-upgrade.json` is the manifest that defines the upgraded version of the app. Once you update your app configuration with the contents of this manifest, you can use any of the upgrade prompts provided by the app in Slack to begin the upgrade. The app will now be capable of listening for `app_mention` events and reacting to those messages signalling that the upgrade on this workspace was successful.

### `app.js`

`app.js` is the entry point for the application and is the file you'll run to start the server. This project aims to keep this file as thin as possible, primarily using it as a way to route inbound requests.

### `/listeners`

Every incoming request is routed to a "listener". Inside this directory, we group each listener based on the Slack Platform feature used, so `/listeners/shortcuts` handles incoming [Shortcuts](https://api.slack.com/interactivity/shortcuts) requests, `/listeners/views` handles [View submissions](https://api.slack.com/reference/interaction-payloads/views#view_submission) and so on.


## OAuth

This sample uses a `FileInstallationStore` to store tokens in plain-text in the `./installs` directory (created after first installation). While this technique is not recommended for production apps, it allows you to easily inspect authorizations and avoids the need to set up a database when developing with this app.

When using OAuth, Slack requires a public URL where it can send requests. In this template app, we've used [`ngrok`](https://ngrok.com/download). Checkout [this guide](https://api.slack.com/tutorials/tunneling-with-ngrok) for setting it up.

Start `ngrok` to access the app on an external network and create a redirect URL for OAuth. 

```
ngrok http 3000
```

This output should include a forwarding address for `http` and `https` (we'll use `https`). It should look something like the following:

```
Forwarding   https://3cb89939.ngrok.io -> http://localhost:3000
```

Navigate to **OAuth & Permissions** in your app configuration and click **Add a Redirect URL**. The redirect URL should be set to your `ngrok` forwarding address with the `slack/oauth_redirect` path appended. For example:

```
https://3cb89939.ngrok.io/slack/oauth_redirect
```

## Testing the app

### Staring with the basic app version

Once your environment values are saved, your Slack app is configured (with starting), and your Bolt server is running, you'll need to install the app to your test workspace. Complete this step by visiting http://localhost:3000 in your browser and follow the prompts to install the app. If successful, the install details and token will be saved to the `./installs` directory with your workspace's team ID used as a subdirectory name.

Open Slack and try one of the following interactions:

- Open the App Home by quick switching to "Upgrade App Bot" or finding the app in the **Apps** view. The App Home contains a link to the "web app", some basic install details (including the currently installed scopes -- there should be only two if this is a new install using the `manifest.json`), a test notification button, and an action to uninstall the app.
- Use the `/check-app-version` slash command in any conversation.
- Use the `Check app version` global shortcut from the **+** icon in the message composer or using the search bar at the top of the Slack client.

### Upgrading the app

Once you are happy with how the app is currently working, you'll want to update your Slack app config to match what the app expects as the updated version. This step simulates an app developer updating their Slack app config, submitting it to the Slack app directory, and releasing it publicly.

In the **App Manifest** tab of your Slack app config, overwrite the entire manifest with the contents of `manifest-upgrade.json`. Optionally, manually key in the additional bot scopes and bot event and save the new configuration.

The last step in signalling that the app is ready for an update is to set the `SLACK_PROMPT_INSTALL` environment variable to `true`.

Back in Slack, navigate to the App Home and test the various command and actions to notice how they have changed. Initiate an upgrade of the app by following any of the upgrade prompts now visible in Slack. This will add new scopes to your existing token which will unlock the new abilities on the workspace (such as listening for the `app_mention` event). The existing bot token will remain the same, but Slack will have appended new permission scopes to the granular bot token.

Once installed, the App Home will reflect this change and end users will no longer see upgrade prompts when interacting with the app. Since this app only includes bot scopes (i.e. no user token scopes are installed or requested), the app is now upgraded for every user on the workspace.

### Uninstall the app

Uninstall the app to revoke the active bot token on your workspace. You cannot remove individual permission scopes from a given token. You can only append new ones. So revoking the bot token (which is equivalent to fully uninstalling the app), will remove every permission scopes previously installed.

You do not have to downgrade your Slack app config to remove the scopes and event that were previously added. Because the reinstall will use the starting/basic set of scopes, the `app_mention` event of the upgraded app will not be sent to your app. Any requests to `reactions.add` would not work either.

Reinstall the app from the newly updated App Home view† or by visiting the web app at http://localhost:3000.

†Note: this view is only temporarily available. Once an app is uninstalled from the workspace, the **Home** tab will be removed after the next client refresh. The **Messages** (in an archived state) and **About** tab will persist.