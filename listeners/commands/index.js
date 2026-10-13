import { commandCheckAppVersion } from './command-check-version.js';

export const register = (app) => {
  app.command('/check-app-version', commandCheckAppVersion);
};
