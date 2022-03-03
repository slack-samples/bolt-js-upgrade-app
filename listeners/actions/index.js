const { actionLaunchWeb } = require('./action-launch-web');
const { actionUpgradeApp } = require('./action-upgrade-app');
const { actionUninstallApp } = require('./action-uninstall-app');
const { actionTestApp } = require('./action-test-app');

module.exports.register = (app) => {
  app.action('btn-launch-web', actionLaunchWeb);
  app.action('btn-upgrade-app', actionUpgradeApp);
  app.action('btn-uninstall-app', actionUninstallApp);
  app.action('btn-test-notif', actionTestApp);
};
