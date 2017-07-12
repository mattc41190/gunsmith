const request = require('request');
const options = {
  uri: 'http://34.227.9.240/test',
  method: 'POST',
  json: {
    "site": "http://54.174.233.198/",
    "endpoint": "small",
    "duration": "10",
    "virtualusers": "1"
  }
};

request(options, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
