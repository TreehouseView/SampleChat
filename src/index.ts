'use strict';

import * as express from 'express';
import * as http from 'http';
import * as nano from 'nano';
import webSocketSetup from './WebSocket/WebSocketBroker';
import * as uWebSockets from 'uWebSockets.js';


const nanoClient = nano('http://admin:1password1@localhost:5984');
const port = 3000;

// Setup Database
nanoClient.db.create('treehouse')
    .catch((err) => {console.log(err.reason)});

const appOptions = {};
const app = uWebSockets.App(appOptions);
webSocketSetup(app);

app.any('/*', (res, req) => {
    res.end('Hello!');
})

app.listen(port, (token) => {
    if (token) {
        console.log('Listening to port ' + port);
    }
    else {
        console.log('Failed to listen to port ' + port);
    }
});


