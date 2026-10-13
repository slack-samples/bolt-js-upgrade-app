import { shortcutCheckAppVersion } from './shortcut-check-app-version.js';

export const register = (app) => {
  app.shortcut('shortcut_check_app_version', shortcutCheckAppVersion);
};
