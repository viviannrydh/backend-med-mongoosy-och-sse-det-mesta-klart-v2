// Require and setup mongoosy
const { app } = require('mongoosy')({
  expressJson: {
    limit: '100mb'
  },
  connect: {
    url: require('./settings/dbConnectionUrl.json')
  },
  // Please change the salt before creating any users
  login: {
    encryptionSalt: 'unique and hard to guess'
  }
});

// Add logic to handle SSE (Server Sent Events)
require('./SSE-handler')(app);

// Start the Express web server
app.listen(4000, () =>
  console.log('Backend running!'));