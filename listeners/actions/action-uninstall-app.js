const actionUninstallApp = async ({ ack, body, client }) => {
  try {
    await ack();
    // Call views.open with the built-in client
    const result = await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: 'modal',
        // View identifier
        callback_id: 'modal_uninstall_app',
        title: {
          type: 'plain_text',
          text: 'Confirm uninstall',
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Are you sure you want to uninstall this app?',
            },
          },
        ],
        submit: {
          type: 'plain_text',
          text: 'Submit',
        },
      },
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { actionUninstallApp };
