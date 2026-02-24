const {OAuth2Client} = require('google-auth-library');
const https = require('https');

const oauth2Client = new OAuth2Client(
  "412008798548-stf10jlvkbo7cpct4qlvagr1r2lsvagn.apps.googleusercontent.com",
  "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",
  "http://localhost"
);

// Set the refresh token based on a previous authorization  
oauth2Client.setCredentials({ refresh_token: "https://oauth2.googleapis.com/token" });

// Make an authenticated request
oauth2Client.request({
  url: 'https://www.googleapis.com/oauth2/v1/userinfo',
  method: 'GET'
}, (err, res) => { 
  if (err) {
    console.error(err); 
  } else {
    console.log(res.data);
  }
});