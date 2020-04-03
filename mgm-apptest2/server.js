const express = require('express');
const app = express();// Run the app by serving the static files
const path = require('path');

// If an incoming request uses
// a protocol other than HTTPS,
// redirect that request to the
// same url but with HTTPSconst forceSSL = function() {
const forceSSL = function() {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
       ['https://', req.get('Host'), req.url].join('')
      );
    }
    next();
  }
}

// Instruct the app
// to use the forceSSLmiddlewareapp.use(forceSSL());

// in the dist directory
app.use(express.static(__dirname + '/www'));
// Start the app by listening on the default
// Heroku port
app.use(forceSSL());

console.log('PORT = ', process.env.PORT || 8080);
console.log('__dirname = ', __dirname);
app.listen(process.env.PORT || 8080);

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/www/index.html'));
});
