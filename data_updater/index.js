const {OAuth2Client} = require(`google-auth-library`);
const https = require(`https`);
const fs = require(`fs`);

const oauth2Client = new OAuth2Client(
  `124890897220-osok6djdtm7ui32pgrjufhn8u.apps.googleusercontent.com`,
  `GOCSPX-HVqsRPd2qC9Wd9oRPx8n3V`,
  `http://localhost:8000/redirect`  
);

// Generate auth URL and redirect user for authorization
const authUrl = oauth2Client.generateAuthUrl({
  access_type: `offline`,
  scope: [`email`, `profile`, `https://www.googleapis.com/auth/drive.metadata.readonly`] 
});

console.log(authUrl); 

// Exchange auth code for tokens after user grants permission
function getTokens(authCode) {
  oauth2Client.getToken(authCode, (err, tokens) => {
    if (err) {
      console.error(`Error getting oAuth tokens:`);
      throw err;
    }
    oauth2Client.setCredentials(tokens);

    fs.writeFile(`tokens.json`, JSON.stringify(tokens), () => console.log(`Auth tokens stored to tokens.json`));

    makeAPIRequest();
  });
}

function makeAPIRequest() {
  oauth2Client.request({
    url: `https://www.googleapis.com/oauth2/v1/userinfo`,
    method: `GET`
  }, (err, res) => {
    if (err) {
      console.error(err); 
    } else {
      console.log(res.data); 
    }
  });
}

// Read previously stored tokens from file
fs.readFile(`tokens.json`, (err, tokens) => {
  if (err) {
    return console.error(`No stored tokens found`);
  } 

  oauth2Client.setCredentials(JSON.parse(tokens)); 
  makeAPIRequest();
});