const actionLaunchWeb = async ({ ack }) => {
  try {
    await ack();
  } catch (error) {
    console.error(error);
  }
};

export { actionLaunchWeb };
