'use strict';

import * as express from 'express';
import * as http from 'http';
import * as nano from 'nano';
import {WebSocketBroker} from './WebSocketBroker';
import * as uWebSockets from 'uWebSockets.js';


const nanoClient = nano('http://admin:1password1@localhost:5984');
const wsBroker = new WebSocketBroker(nanoClient);
const port = 3000;

// Setup Database
nanoClient.db.create('treehouse')
    .catch((err) => {console.log(err.reason)});

const app = uWebSockets.App({})
.ws('/chatPortal', 
    { 
        compression: uWebSockets.SHARED_COMPRESSOR,

        maxPayloadLength: 16 * 1024 * 1024,

        idleTimeout: 10,

        upgrade: (res, req, context) => {
            console.log('Upgrade request: ' + req.getUrl());

            res.upgrade({
                url: req.getUrl()
            },req.getHeader('sec-websocket-key'),
                       req.getHeader('sec-websocket-protocol'),
                       req.getHeader('sec-websocket-extensions'),
                       context);
        },

        open: (ws) => {
            console.log('a websocket connected with URL: ' + ws.url);
        },

        message: (ws, messageBuffer, isBinary) => {
            
            // If not binary, assume text
            if (!isBinary) {
                console.log('message not binary');
                let message = String.fromCharCode.apply(null, new Uint8Array(messageBuffer));
                console.log('message received: ' + message);
            }
            //let ok = ws.send(message, isBinary);
        },

        drain: (ws) => {
            console.log('Websocket backpressure: ' + ws.getBufferedAmount);
        },

        close: (ws, code, message) => {
            console.log('Websocket closed');
        }
    }
).any('/*', (res, req) => {
    res.end('Hello!');
}).listen(port, (token) => {
    if (token) {
        console.log('Listening to port ' + port);
    }
    else {
        console.log('Failed to listen to port ' + port);
    }
});


