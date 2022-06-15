const viewUninstallApp = async ({ ack, body, client }) => {
  await ack();

  try {
    // This view will not be visible to end users indefinitely.
    // But will be for a short time after uninstall which is helpful for testing a reinstallation.
    // After some time, only the Message and About time are accessible to users of uninstalled apps.
    await client.views.publish({
      user_id: body.user.id,
      view: {
        type: 'home',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'Goodbye ...',
            },
          },
          {
            type: 'section',
            block_id: 'sec_uninstalled_message',
            text: {
              type: 'mrkdwn',
              text: `This app has been uninstalled. Click <${process.env.SLACK_HOSTNAME}/install|here> to reinstall the base version of this app.`,
            },
          }],
      },
    });
  } catch (error) {
    console.error(error);
    return;
  }

  try {
    // Since this app only uses bot scopes, revoking the token is
    // equivalent to uninstalling the entire app from the workspace.
    const result = await client.auth.revoke({});
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { viewUninstallApp };
