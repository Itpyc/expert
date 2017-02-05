/**
 * Created by Administrator on 2017/1/6.
 */
var app = require('express')();
var fs = require('fs');
var http = require('http');
//var https = require('https');
/*
var privateKey  = fs.readFileSync('/path/to/private.pem', 'utf8'),
var certificate = fs.readFileSync('/path/to/file.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
*/
var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);
var PORT = 3001;
var SSLPORT = 18081;

httpServer.listen(PORT, function() {
  console.log('HTTP Server is running on: http://localhost:%s', PORT);
});
/*httpsServer.listen(SSLPORT, function() {
  console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});*/

// Welcome
app.get('/', function(req, res) {

});
