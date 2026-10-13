import { viewUninstallApp } from './view-uninstall-app.js';
import { viewSendTestNotif } from './view-send-test-notif.js';

export const register = (app) => {
  app.view('modal_uninstall_app', viewUninstallApp);
  app.view('modal_send_test_notif', viewSendTestNotif);
};
