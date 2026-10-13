import { appHomeOpenedCallback } from './app-home-opened.js';
import { appMentionCallback } from './app-mention.js';

export const register = (app) => {
  app.event('app_home_opened', appHomeOpenedCallback);
  app.event('app_mention', appMentionCallback);
};
