const actionLaunchWeb = async ({ ack }) => {
  try {
    await ack()
  } catch (error) {
    console.error(error);
  }
};

module.exports = { actionLaunchWeb };
