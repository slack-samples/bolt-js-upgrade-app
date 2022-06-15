require('dotenv').config();

const viewSendTestNotif = async ({ ack, client, body, respond }) => {
  try {
    await ack();

    // Prepare default message if an upgrade isn't available or necessary
    let upgrade = false;

    // eslint-disable-next-line prefer-const
    const message = {
      response_type: 'in_channel',
      text: 'What do you know, it works?',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: 'What do you know, it works?',
          },
        },
      ],
    };

    // Check permission scopes of current installation
    // Can directly check `X-OAuth-Scopes` response header if desired
    const result = await client.auth.test({});
    const { scopes } = result.response_metadata;

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
      message.blocks.push({
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `:sparkles: _A new version of this app is available! Click <https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=${process.env.SLACK_UPGRADE_SCOPES}&team=${body.team.id}|here> to upgrade._`,
          },
        ],
      });
    }

    // If the user selected themselves as the test message destination, send them a message via
    // the bot DM instead of with response_url which goes to their private DM with themselves.

    // If you select a DM with any other user, the message is actually posted to your DM with
    // that user rather than the Bot's DM with that user. This is just how the
    // `response_url_enabled` arg works for the conversation select in input blocks in modals.
    if (body.response_urls[0].channel_id === body.user.id) {
      await client.chat.postMessage({
        channel: body.user.id,
        blocks: message.blocks,
        text: message.text,
      });
    } else {
      await respond(message);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { viewSendTestNotif };
