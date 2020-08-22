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
    idleTimeout: 100,
    upgrade: function (res, req, context) {
        console.log('Upgrade request: ' + req.getUrl());
        res.upgrade({
            url: req.getUrl()
        }, req.getHeader('sec-websocket-key'), req.getHeader('sec-websocket-protocol'), req.getHeader('sec-websocket-extensions'), context);
    },
    open: function (ws) {
        console.log('a websocket connected with URL: ' + ws.url);
        // Subscribe to the global channel.
        // This should represent the whole organization.
        // This channel is used to send system messages.
        // No discussion messages should be sent to this 
        // channel
        ws.subscribe('/treehouse');
    },
    message: function (ws, messageBuffer, isBinary) {
        // If not binary, assume text
        if (!isBinary) {
            console.log('message not binary');
            var rawMessage = String.fromCharCode.apply(null, new Uint8Array(messageBuffer));
            var message = null;
            try {
                message = JSON.parse(rawMessage);
                console.log('message received: ' + message.message_type);
            }
            catch (err) {
                message = rawMessage;
            }
            ;
            switch (message.message_type) {
                case 'login':
                    // Register username to socket object
                    ws.organization = {
                        company: {
                            name: 'treehouse'
                        },
                        user: {
                            id: 1234,
                            name: message.username
                        }
                    };
                    console.log('Sending login message');
                    ws.publish('/' + ws.organization.company.name, JSON.stringify({
                        message_type: 'user_login',
                        user_info: {
                            name: ws.organization.user.name,
                            id: '1234'
                        }
                    }), false);
                    break;
                case 'logout':
                    ws.publish('/' + ws.organization.company.name, JSON.stringify({
                        message_type: 'user_logout',
                        user_info: ws.organization.user
                    }), false);
                    ws.end(111111, JSON.stringify({ user: ws.organization.user }));
                    break;
                case 'chat':
                    console.log('message received from ' + ws.organization.user.name + ': ' + message.body);
                    ws.publish('/' + message.topic, JSON.stringify({
                        message_type: 'chat',
                        source_name: ws.organization.user.name,
                        body: message.body,
                        topic: message.topic
                    }), false);
                    break;
                case 'channel_create':
                    console.log('Creating channel: ' + message.name);
                    ws.publish('/' + ws.organization.company.name, JSON.stringify({
                        message_type: 'channel_created',
                        name: message.name
                    }), false);
                    break;
                case 'select_channel':
                    ws.subscribe('/' + message.topic);
                    break;
                default:
                    console.log('Unknown message type received: ' + message.message_type);
                    break;
            }
        }
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
