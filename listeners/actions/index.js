const { actionLaunchWeb } = require('./action-launch-web');
const { actionUpgradeApp } = require('./action-upgrade-app');
const { actionUninstallApp } = require('./action-uninstall-app');
const { actionTestApp } = require('./action-test-app');

module.exports.register = (app) => {
  app.action('btn_launch_web', actionLaunchWeb);
  app.action('btn_upgrade_app', actionUpgradeApp);
  app.action('btn_uninstall_app', actionUninstallApp);
  app.action('btn_test_notif', actionTestApp);
};
