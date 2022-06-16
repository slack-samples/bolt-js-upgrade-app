require('dotenv').config();

const appHomeOpenedCallback = async ({ client, event, body }) => {
  // Ignore the `app_home_opened` event for anything but the Home tab
  if (event.tab !== 'home') return;

  try {
    // Check permission scopes of current installation
    // Can directly check `X-OAuth-Scopes` response header if desired
    const result = await client.auth.test({});
    const { scopes } = result.response_metadata;

    // Prepare default app home view if an upgrade isn't available or necessary
    let upgrade = false;

    const view = {
      type: 'home',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'Upgrade App Sample',
            emoji: true,
          },
        },
        {
          type: 'actions',
          block_id: 'blk_actions_main',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Open web app',
              },
              action_id: 'btn_launch_web',
              url: `${process.env.SLACK_HOSTNAME}/app`,
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'Current installation details',
            emoji: true,
          },
        },
        {
          type: 'section',
          block_id: 'sec_install_details',
          text: {
            type: 'mrkdwn',
            text: `*Bot user name:* <@${result.user_id}>\n*Bot user ID:* \`${result.user_id}\`\n*Scopes:* \`${scopes.join(', ')}\``,
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'Testing actions',
            emoji: true,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Try the `/check-app-version` slash command.\nTry the *Check app version* global shortcut.',
          },
        },
        {
          type: 'actions',
          block_id: 'blk_actions_testing',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Send test notification',
              },
              action_id: 'btn_test_notif',
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'Uninstall app',
            emoji: true,
          },
        },
        {
          type: 'section',
          block_id: 'sec_uninstall_details',
          text: {
            type: 'mrkdwn',
            text: 'To uninstall the app and revoke the bot token, click the button below. The app will be uninstalled for all users on the workspace. You will need to reinstall the app to regain access to this page.',
          },
        },
        {
          type: 'actions',
          block_id: 'blk_actions_uninstall',
          elements: [
            {
              type: 'button',
              style: 'danger',
              text: {
                type: 'plain_text',
                text: 'Uninstall',
              },
              action_id: 'btn_uninstall_app',
            },
          ],
        },
      ],
    };

    // Check if current install is using latest scopes by comparing the output of auth.est
    // to the upgraded scopes pulled from the environment variable.
    const upgradeScopes = process.env.SLACK_UPGRADE_SCOPES.split(',');

    upgradeScopes.forEach((scope) => {
      if (!scopes.includes(scope)) {
        upgrade = true;
      }
    });

    // If the scopes don't match and we have decided that an app update is available,
    // we can update the app home view blocks to inform user that an updated version
    // is availble for them to review and install to the workspace.
    if (upgrade && process.env.SLACK_PROMPT_INSTALL === 'true') {
      view.blocks.splice(1, 0, {
        type: 'section',
        block_id: 'sec_upgrade_details',
        text: {
          type: 'mrkdwn',
          text: '_A new version of this app is available!_',
        },
      });

      // Accessing section block of default app home view
      const appHomeActionBtns = view.blocks[2];

      // Link to webpageinstructing user that an upgrade is available
      const openWebAppBtn = appHomeActionBtns.elements[0];
      openWebAppBtn.url = `${process.env.SLACK_HOSTNAME}/upgrade`;

      // Add a second action button that provides a direct install link to upgrade immediately
      appHomeActionBtns.elements.push({
        type: 'button',
        style: 'primary',
        text: {
          type: 'plain_text',
          text: ':sparkles: Upgrade app :sparkles:',
          emoji: true,
        },
        action_id: 'btn_upgrade_app',
        url: `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=${process.env.SLACK_UPGRADE_SCOPES}&team=${body.authorizations[0].team_id}`,
      });
    }

    // If by this point we don't need to upgrade, this means the current install contains the
    // full set of possible scopes and the install is considered fully upgraded.
    // Added functionality is available so we can share this with the user correct section.

    if (!upgrade) {
      // Accessing 'Testing action' section of default app home view so we can append some text.
      const appHomeTestingSection = view.blocks[7];

      // Upgraded apps have a new feature where you can @-mention the bot
      const newFeatureDesc = '\n`/invite` the bot to a channel and @-mention it.';
      appHomeTestingSection.text.text += newFeatureDesc;
    }

    try {
      await client.views.publish({
        user_id: event.user,
        view,
      });
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { appHomeOpenedCallback };
