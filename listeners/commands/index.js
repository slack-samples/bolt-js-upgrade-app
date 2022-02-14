const { commandCheckAppVersion } = require('./command-check-version');

module.exports.register = (app) => {
  app.command('/check-app-version', commandCheckAppVersion);
};
