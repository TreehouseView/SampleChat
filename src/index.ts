'use strict';

import * as express from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});

io.on('connection', (socket) => {
    console.log(socket.id.toString() + ' connected');
    io.emit('chat message', 'Hi and welcome to PIIG chat service!');
    socket.on('chat message', (msg) => {
        console.log(socket.id.toString() + ' sent message: ' + msg);
        socket.broadcast.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user ' + socket.id.toString() + ' disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening');
});

