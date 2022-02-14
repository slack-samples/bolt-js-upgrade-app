const { appHomeOpenedCallback } = require('./app-home-opened');
const { appMentionCallback } = require('./app-mention');

module.exports.register = (app) => {
  app.event('app_home_opened', appHomeOpenedCallback);
  app.event('app_mention', appMentionCallback);
};
