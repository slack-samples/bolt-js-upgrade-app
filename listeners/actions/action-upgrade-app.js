const actionUpgradeApp = async ({ ack }) => {
  try {
    await ack();
  } catch (error) {
    console.error(error);
  }
};

module.exports = { actionUpgradeApp };
