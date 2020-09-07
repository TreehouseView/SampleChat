'use strict';
exports.__esModule = true;
var nano = require("nano");
var WebSocketBroker_1 = require("./WebSocket/WebSocketBroker");
var uWebSockets = require("uWebSockets.js");
var nanoClient = nano('http://admin:1password1@localhost:5984');
var port = 3000;
// Setup Database
nanoClient.db.create('treehouse')["catch"](function (err) { console.log(err.reason); });
var appOptions = {};
var app = uWebSockets.App(appOptions);
WebSocketBroker_1["default"](app);
app.any('/*', function (res, req) {
    res.end('Hello!');
});
app.listen(port, function (token) {
    if (token) {
        console.log('Listening to port ' + port);
    }
    else {
        console.log('Failed to listen to port ' + port);
    }
});
