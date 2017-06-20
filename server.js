var http = require('http'),
  httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();
httpProxy.createProxyServer().listen(1337);
http.createServer(function (req, res) {
  proxy.web(req, res, {
    target: 'https://g41mjebaw2.execute-api.us-east-1.amazonaws.com/v1_0'
  });
}).listen(1338);
// var path = require('path');
// var express = require('express');
// var bodyParser = require('body-parser');
// var cors = require('cors');
// var qs = require('querystring');
// var request = require('request');
// var app = express();
// var port = process.env.port || process.env.PORT || 1337;
// var dir = 'dist';
// var assetPath = path.join(__dirname, dir);
// var domain = 'https://g41mjebaw2.execute-api.us-east-1.amazonaws.com/v1_0';
//
// global.ROOTPATH = assetPath;
//
// // Config
// app.set('port', port);
// app.use(cors());
// app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// app.use(express.static(assetPath));
//
// // Proxies
// app.post('/*', function (req, res){
//   var url = domain + '/' + req.params[0];
//   if (qs.stringify(req.query) !== "") {
//     url += '?' + qs.stringify(req.query);
//   }
//   console.log("POST: " + domain + '/' + req.params[0]);
//   console.log("POST DATA:");
//   console.log(req.body);
//   req.pipe(request({
//     url: url,
//     method: req.method,
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     },
//     body: JSON.stringify(req.body)//,
//     //headers: req.headers
//   }, function (error, response, body){
//     if (error && error.code === 'ECONNREFUSED') {
//       console.error('Refused connection');
//     } else {
//       throw error;
//     }
//   }), {end: false}).pipe(res);
// });
//
// app.get('/*', function (req, res){
//   var url = domain + '/' + req.params[0];
//   if (qs.stringify(req.query) !== "") {
//     url += '?' + qs.stringify(req.query);
//   }
//   console.log("GET: " + domain + '/' + req.params[0]);
//   req.pipe(request({
//     url: url,
//     method: req.method,
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     },
//     body: JSON.stringify(req.body)//,
//     //headers: req.headers
//   }, function (error, response, body){
//     if (error && error.code === 'ECONNREFUSED') {
//       console.error('Refused connection');
//     } else {
//       throw error;
//     }
//   }), {end: false}).pipe(res);
// });
//
// app.patch('/*', function (req, res){
//   var url = domain + '/' + req.params[0];
//   if (qs.stringify(req.query) !== "") {
//     url += '?' + qs.stringify(req.query);
//   }
//   console.log("PATCH: " + domain + '/' + req.params[0]);
//   console.log("PATCH DATA:");
//   console.log(req.body);
//   req.pipe(request({
//     url: url,
//     method: req.method,
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     },
//     body: JSON.stringify(req.body)//,
//     //headers: req.headers
//   }, function (error, response, body){
//     if (error && error.code === 'ECONNREFUSED') {
//       console.error('Refused connection');
//     } else {
//       throw error;
//     }
//   }), {end: false}).pipe(res);
// });
//
// app.delete('/*', function (req, res){
//
//   var url = domain + '/' + req.params[0];
//   if (qs.stringify(req.query) !== "") {
//     url += '?' + qs.stringify(req.query);
//   }
//   console.log("DELETE: " + domain + '/' + req.params[0]);
//   req.pipe(request({
//     url: url,
//     method: req.method,
//     headers: {
//       'Content-Type': 'application/json;charset=UTF-8'
//     },
//     body: JSON.stringify(req.body)//,
//     //headers: req.headers
//   }, function (error, response, body){
//     if (error && error.code === 'ECONNREFUSED') {
//       console.error('Refused connection');
//     } else {
//       throw error;
//     }
//   }), {end: false}).pipe(res);
// });
//
// app.listen(app.get('port'), function (){
//   console.log('Express server listening on port ' + app.get('port'));
// });
//
// process.on('uncaughtException', function (err){
//   if (err) {
//     console.error('uncaughtException: ' + err.message);
//     console.error(err.stack);
//     //process.exit(1);             // exit with error
//   }
// });
