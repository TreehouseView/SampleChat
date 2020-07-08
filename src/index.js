'use strict';
exports.__esModule = true;
var express = require("express");
var http = require("http");
var socketio = require("socket.io");
var app = express();
var server = http.createServer(app);
var io = socketio(server);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/static/index.html');
});
io.on('connection', function (socket) {
    console.log(socket.id.toString() + ' connected');
    io.emit('chat message', 'Hi and welcome to PIIG chat service!');
    socket.on('chat message', function (msg) {
        console.log(socket.id.toString() + ' sent message: ' + msg);
        socket.broadcast.emit('chat message', msg);
    });
    socket.on('disconnect', function () {
        console.log('user ' + socket.id.toString() + ' disconnected');
    });
});
server.listen(3000, function () {
    console.log('listening');
});
