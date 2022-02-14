const appMentionCallback = async ({ client, event }) => {

  try {

    const react = reaction => {
      return new Promise(resolve => {
        client.reactions.add({
          channel: event.channel,
          name: reaction,
          timestamp: event.ts
        })
      })
    }

    // Reacting with three emoji and putting a second of timeout
    // between each so they don't all react at once.
    react('wave')
    .then(setTimeout(()=>{react('white_check_mark')}, 1000))
    .then(setTimeout(()=>{react('robot_face')}, 2000))
  }
  catch (error) {
    console.error(error);
  }
};

module.exports = { appMentionCallback };
