require('dotenv').config();

const commandCheckAppVersion = async ({ ack, client, body, respond }) => {
  try {
    await ack();

    // Check permission scopes of current installation
    // Can directly check `X-OAuth-Scopes` response header if desired
    const result = await client.auth.test({});
    const { scopes } = result.response_metadata;

    // Prepare default message if an upgrade isn't available or necessary
    let upgrade = false;

    const message = {
      response_type: 'in_channel',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'What do you know, it works? _You have the latest version!_',
          },
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
    // we can update the blocks to give the user a custom update message.
    if (upgrade && process.env.SLACK_PROMPT_INSTALL === 'true') {
      message.blocks[0].text.text = 'What do you know, it works?';

      message.blocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `:sparkles: _A new version of this app is available! Click <https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=${process.env.SLACK_UPGRADE_SCOPES}&team=${body.team_id}|here> to upgrade._`,
          },
        ],
      });
    }

    await respond(message);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { commandCheckAppVersion };
