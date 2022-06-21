# Upgrade App Manager

_Learn how to check if a Slack app is using the latest permission scopes and the techiques to prompt users to install if an upgrade is needed._

## Background

Slack does not currently provide a way for end users to know that a newer version of an app is available. While an app can change all the backend code it likes to provide updated functionality to the end user, if those updates require new permission scopes, those new scopes must first be appended to the existing installation before any new features can be used on the workspace. While admins can check an app's directory listing page to see if new scopes are available for proactive approval, there isn't an obvious way for an admin to know when to check this page nor how to initiate the update if one is available.

The responsibility falls to app developers to notify admins and end users in Slack when such an update requiring action (i.e. install to append new scopes) is available. This sample app combines several of those techniques in a single app so that developers can learn where/how to creatively alert users when app updates are available to their workspace. In this way, workspaces can be updated quicker and more effectively rather than lagging behind the latest release and requiring support to understand why/how to access new features.

## Project setup

### Create a Slack App
1. Open [https://api.slack.com/apps/new](https://api.slack.com/apps/new) and choose "From an app manifest".
2. Choose the workspace you want to install the application to.
3. Copy the entire contents of [manifest.json](./manifest.json) into the JSON text box (replacing the placeholder text) and click *Next*.
4. Review the configuration and click *Create*.

### Environment Variables
Before you can run the app, you'll need to create an `.env` file and update the secrets:

1. Copy `.env.sample` to `.env`
2. Open your newly created app's configuration page from [this list](https://api.slack.com/apps), click *Basic Information* from the left hand menu, and copy the values for the `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, `SLACK_SIGNING_SECRET` into your `.env` file.
3. Follow the steps in the *App-Level Tokens* section of your app config to create an app-level token with the `connections:write` scope. Give it whatever name you like and copy the token into your `.env` as `SLACK_APP_TOKEN`.
4. Set `SLACK_HOSTNAME` to `https://<site>.ngrok.io` if using ngrok ([see guide below](#oauth)) or to the public endpoint of your choice where your app will be running. Set `SLACK_REDIRECT_URI` to the same domain but include the path `/slack/oauth_redirect`. Delete or overwrite the placeholder value `http://localhost/slack/oauth_redirect`.
5. Set `SLACK_START_SCOPES` to `chat:write,commands` and your `SLACK_UPGRADE_SCOPES` to `chat:write,commands,app_mentions:read,reactions:write`.
6. Finally, set `SLACK_PROMPT_INSTALL` to `false` to start.

### Install Dependencies

``` bash
git clone https://github.com/slack-samples/bolt-js-upgrade-app.git
cd bolt-js-upgrade-app
npm install
```

### Run Bolt Server

`npm start` or

`npm start dev` (_automatically restarting the node application when file changes_)

## Project Structure

### `manifest.json`

`manifest.json` is the configuration file for the Slack app you create. With a manifest, you can create an app with a pre-defined configuration, or adjust the configuration of an existing app.

### `app.js`

`app.js` is the entry point for the application and is the file you'll run to start the server. This project aims to keep this file as thin as possible, primarily using it as a way to route inbound requests and custom http routes.

### `/listeners`

Every incoming request is routed to a "listener". Inside this directory, we group each listener based on the Slack Platform feature used, so `/listeners/shortcuts` handles incoming [Shortcuts](https://api.slack.com/interactivity/shortcuts) requests, `/listeners/views` handles [View submissions](https://api.slack.com/reference/interaction-payloads/views#view_submission) and so on.

### `/templates`

Stores the HTML files rendered by the various custom http routes to simulate an app's external web application. 

## OAuth

This sample uses [Bolt's](https://slack.dev/bolt-js/concepts#authenticating-oauth) `FileInstallationStore` to store tokens in plain-text in the `./installs` directory (created after first installation). While this technique is not recommended for production apps, it allows you to easily inspect authorizations and avoids the need to set up a database when developing with this app.

When using OAuth, Slack requires a public URL where it can redirect requests so your app can generate a token. In this sample app, [`ngrok`](https://ngrok.com/download) is being used. Checkout [this guide](https://ngrok.com/docs/getting-started) for setting it up.

Start `ngrok` in your terminal (and leave this window open) to access the app on an external network and create a redirect URL for OAuth.

```bash
ngrok http 3000
```

This output should include a forwarding address for `http` and `https` (we'll use `https`). It should look something like the following:

```bash
Forwarding   https://3cxb89939.ngrok.io -> http://localhost:3000
```

Navigate to **OAuth & Permissions** in your app configuration and click **Add a Redirect URL**. The redirect URL should be set to your `ngrok` forwarding address with the `slack/oauth_redirect` path appended. For example:

```
https://3cxb89939.ngrok.io/slack/oauth_redirect
```

The URL that ngrok generates is what you use when populating your [environment variables](#environment-variables).

## Using the app

### Staring with the basic app version

Once your environment values are saved, your Slack app is configured, and your Bolt server is running (and ngrok tunnel, if applicable), you'll need to install the app to your workspace. Complete this step by visiting http://localhost:3000 (or your ngrok URL, e.g. https://3cxb89939.ngrok.io) in your browser and following the prompts to install the app.

![Web app when accessed in your web browser](/images/web-app-landing-page.png "Web app landing page")

If successful, the install details and token will be saved to the `./installs` folder of your current working directory with your workspace's team ID used as a subdirectory name.

The link you just clicked at the root domain of your web app will always install the starting scopes `chat:write` & `commands` (i.e. `SLACK_START_SCOPES`). This is because you don't want to install additional scopes right away. You need the opportunity to prompt the user to reinstall the app with additional permissions.

Open Slack and try one of the following interactions:

- Open the App Home by quick switching to "Upgrade App Bot" or finding the app in the **Apps** view. The App Home contains a link to the "web app", some basic install details (including the currently installed scopes -- there should be only two if this is a new install using the `manifest.json`), a test notification button, and an action to uninstall the app.
- Use the `/check-app-version` slash command in any conversation.
- Use the `Check app version` global shortcut from the **+** icon in the message composer or using the search bar at the top of the Slack client.

![App Home with starting scopes, upgrade available](/images/pre-upgrade-app-home.png "App Home with upgrade available")

![Modal shown after using the Check app version global shortcut](/images/check-app-version-shortcut.png "Check app version global shortcut")

### Upgrading the app

Once you are happy with how the app is currently working with the starting scopes, you'll want to update your Slack app config to create an updated version of the app. This step simulates an app developer updating their Slack app config, submitting it to the Slack app directory, and releasing it publicly.

In the **App Manifest** tab of your Slack app config, add `"app_mentions:read"` and `"reactions:write"` to the bot scopes section. It should now look like this:

```json
"scopes": {
    "bot": [                
        "chat:write",
        "commands",
        "app_mentions:read",
        "reactions:write"
    ]
}
```

Similarly, add the new bot event `"app_mention"` to the event subscription section. It should now look like this:

```json
"event_subscriptions": {
    "bot_events": [
        "app_home_opened",
        "app_mention"
    ]
},
```

The last step in signalling that the app is ready for an update is to set the `SLACK_PROMPT_INSTALL` environment variable to `true`. This environment variable is used to determine if the app should present upgrade prompt messages to end users as they interact with your app. You will need to restart you Bolt app for this change to be applied.

In the terminal where your Bolt app is running, use the command `Cmd/Ctrl + C` to interrupt the process. Run the app again using ``npm start` or `npm start dev`.

Back in Slack, navigate to the App Home (you might need to open a channel and then return to the App Home to trigger a new `app_home_opened` event) and test the various commands and actions to notice how they now include additional messaging. If you were to invite the bot to a channel and @-mention it, nothing would happen (this is the new feature you'll update to in a moment).

Initiate an upgrade of the app by following any of the upgrade prompts now visible in Slack. This will append new scopes to your existing token which will unlock the new abilities on the workspace (such as listening for the `app_mention` event). The existing bot token will remain the same, but Slack will have appended new permission scopes to the granular bot token.

Once installed, the App Home will reflect this change and end users will no longer see upgrade prompts when interacting with the app since the workspace now has the latest version. Since this app only includes bot scopes (i.e. no user token scopes are installed or requested), the app is now upgraded for every user on the workspace.

![App Home when the app has been fully upgraded](/images/fully-upgraded-app-home.png "App Home after upgrade")

To test the new feature, navigate to any public or private channel, use the command `/invite @Upgrade App Bot`, and then send a message to the channel that includes the bot's display name. If everything is setup correctly and the app upgraded, the bot should react.

**Tip:** Install the app to a second workspace. You'll find that if the installed scopes differs between them, the app home will reflect this and prompt one or both to upgrade if necessary.

### Uninstalling the app

Uninstall the app to revoke the active bot token on your workspace. You cannot remove individual permission scopes from a given token. You can only append new ones. So revoking the bot token (which is equivalent to fully uninstalling the app in this scenario), will remove every permission scope previously installed.

You do not have to downgrade your Slack app config to remove the scopes and `app_mention` event that were previously added. Because the reinstall will use the starting/basic set of scopes, the `app_mention` event of the upgraded app will not be sent to your app. Any requests by your app to `reactions.add` would not work either.

Reinstall the app using the link found in newly updated App Home view† or by visiting the web app at http://localhost:3000 (or your ngrok URL, e.g. https://3cxb89939.ngrok.io). Adjust the `SLACK_PROMPT_INSTALL` as needed to decide if you want to display upgrade messages to users in Slack.

†Note: this view is only temporarily available. Once an app is uninstalled from the workspace, the **Home** tab will be removed after the next client refresh. The **Messages** (in an archived state) and **About** tab will persist.
