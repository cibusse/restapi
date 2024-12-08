const app = require('../app'); // Adjust the path to your app.js file
const serverless = require('serverless-http');

module.exports = serverless(app);
