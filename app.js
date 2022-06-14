const { App, FileInstallationStore, LogLevel } = require('@slack/bolt');
const { registerListeners } = require('./listeners');

const html = require('./templates');

require('dotenv').config();

// Initialization
const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  installerOptions: {
    stateVerification: false,
    port: process.env.PORT,
  },
  installationStore: new FileInstallationStore({
    baseDir: './installs',
    historicalDataEnabled: false,
  }),
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
  customRoutes: [
    {
      path: '/',
      method: ['GET'],
      handler: (req, res) => {
        res.writeHead(200);
        res.end(html.htmlInstall);
      },
    },
    {
      path: '/app',
      method: ['GET'],
      handler: (req, res) => {
        res.writeHead(200);
        res.end(html.htmlApp);
      },
    },
    {
      path: '/install',
      method: ['GET'],
      handler: (req, res) => {
        res.writeHead(200);
        res.end(html.htmlInstall);
      },
    },
    {
      path: '/upgrade',
      method: ['GET'],
      handler: (req, res) => {
        res.writeHead(200);
        res.end(html.htmlUpgrade);
      },
    },
  ],
});

// Register Listeners
registerListeners(app);

// Start Bolt App
(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running! ⚡️');
  } catch (error) {
    console.error('Unable to start App', error);
  }
})();
