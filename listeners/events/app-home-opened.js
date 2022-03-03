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
              action_id: 'btn-launch-web',
              url: 'http://localhost:3000/app',
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
          type: 'actions',
          block_id: 'blk_actions_testing',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Send test notification',
              },
              action_id: 'btn-test-notif',
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
              action_id: 'btn-uninstall-app',
            },
          ],
        },
      ],
    };
    // Check if current install is using latest scopes by comparing to our .env variable
    const upgradeScopes = process.env.SLACK_UPGRADE_SCOPES.split(',');

    upgradeScopes.forEach((scope) => {
      if (!scopes.includes(scope)) {
        upgrade = true;
      }
    });

    // If the scopes don't match and we have decided that an app update is available,
    // we can update the blocks to give the user a custom update elements
    if (upgrade && process.env.SLACK_PROMPT_INSTALL === 'true') {
      view.blocks.splice(1, 0, {
        type: 'section',
        block_id: 'sec_upgrade_details',
        text: {
          type: 'mrkdwn',
          text: '_A new version of this app is available!_',
        },
      });

      view.blocks[2].elements[0].url = 'http://localhost:3000/upgrade';

      view.blocks[2].elements.push({
        type: 'button',
        style: 'primary',
        text: {
          type: 'plain_text',
          text: ':sparkles: Upgrade app :sparkles:',
          emoji: true,
        },
        action_id: 'btn-upgrade-app',
        url: `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=${process.env.SLACK_UPGRADE_SCOPES}&team=${body.authorizations[0].team_id}`,
      });
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
