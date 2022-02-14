const { shortcutCheckAppVersion } = require('./shortcut-check-app-version');

module.exports.register = (app) => {
  app.shortcut('shortcut_check_app_version', shortcutCheckAppVersion);
};
