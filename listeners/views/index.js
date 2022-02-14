const { viewUninstallApp } = require('./view-uninstall-app.js');
const { viewSendTestNotif } = require('./view-send-test-notif');

module.exports.register = (app) => {
  app.view('modal_uninstall_app', viewUninstallApp);
  app.view('modal_send_test_notif', viewSendTestNotif);
};
