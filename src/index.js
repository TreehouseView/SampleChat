'use strict';
exports.__esModule = true;
var nano = require("nano");
var WebSocketBroker_1 = require("./WebSocketBroker");
var uWebSockets = require("uWebSockets.js");
var nanoClient = nano('http://admin:1password1@localhost:5984');
var wsBroker = new WebSocketBroker_1.WebSocketBroker(nanoClient);
var port = 3000;
// Setup Database
nanoClient.db.create('treehouse')["catch"](function (err) { console.log(err.reason); });
var app = uWebSockets.App({})
    .ws('/chatPortal', {
    compression: uWebSockets.SHARED_COMPRESSOR,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 10,
    upgrade: function (res, req, context) {
        console.log('Upgrade request: ' + req.getUrl());
        res.upgrade({
            url: req.getUrl()
        }, req.getHeader('sec-websocket-key'), req.getHeader('sec-websocket-protocol'), req.getHeader('sec-websocket-extensions'), context);
    },
    open: function (ws) {
        console.log('a websocket connected with URL: ' + ws.url);
    },
    message: function (ws, messageBuffer, isBinary) {
        // If not binary, assume text
        if (!isBinary) {
            console.log('message not binary');
            var message = String.fromCharCode.apply(null, new Uint8Array(messageBuffer));
            console.log('message received: ' + message);
        }
        //let ok = ws.send(message, isBinary);
    },
    drain: function (ws) {
        console.log('Websocket backpressure: ' + ws.getBufferedAmount);
    },
    close: function (ws, code, message) {
        console.log('Websocket closed');
    }
}).any('/*', function (res, req) {
    res.end('Hello!');
}).listen(port, function (token) {
    if (token) {
        console.log('Listening to port ' + port);
    }
    else {
        console.log('Failed to listen to port ' + port);
    }
});
