import { actionLaunchWeb } from './action-launch-web.js';
import { actionUpgradeApp } from './action-upgrade-app.js';
import { actionUninstallApp } from './action-uninstall-app.js';
import { actionTestApp } from './action-test-app.js';

export const register = (app) => {
  app.action('btn_launch_web', actionLaunchWeb);
  app.action('btn_upgrade_app', actionUpgradeApp);
  app.action('btn_uninstall_app', actionUninstallApp);
  app.action('btn_test_notif', actionTestApp);
};
