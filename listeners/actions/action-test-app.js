const actionTestApp = async ({ ack, body, client }) => {
  try {
    await ack();
    // Call views.open with the built-in client
    await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: 'modal',
        // View identifier
        callback_id: 'modal_send_test_notif',
        title: {
          type: 'plain_text',
          text: 'Test notification',
        },
        submit: {
          type: 'plain_text',
          text: 'Send message',
        },
        close: {
          type: 'plain_text',
          text: 'Cancel',
        },
        blocks: [
          {
            type: 'input',
            block_id: 'input_conversation_select',
            element: {
              type: 'conversations_select',
              placeholder: {
                type: 'plain_text',
                text: 'Pick a conversation',
              },
              action_id: 'select_notif_conversation',
              response_url_enabled: true,
              initial_conversation: body.user.id,
            },
            label: {
              type: 'plain_text',
              text: 'Send a test message to ...',
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { actionTestApp };
