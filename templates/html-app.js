require('dotenv').config();

let css =
  `
    html {
      margin: 0;
      padding: 0;
    }
    body {
      font-family: sans-serif;
      text-align: center;
      padding-top: 50px;
    }
  `

let htmlApp =
  `
    <!DOCTYPE html>
    <html lang='en'>
    <head>
      <meta charset='UTF-8'>
      <meta name='viewport' content='width=device-width, initial-scale=1'>
      <title>App: Upgrade App Sample</title>
      <style>
        ${css}
      </style>
    </head>
    <body>
      <div>
        <h1>✅ You have the latest version!</h1>
      </div>
    </body>
    </html>
  `

module.exports = htmlApp;
