'use strict';
exports.__esModule = true;
exports.WebSocketBroker = void 0;
var WebSocketBroker = /** @class */ (function () {
    function WebSocketBroker(nanoClient) {
        this.nanoClient = nanoClient;
    }
    WebSocketBroker.prototype.init = function (io, socket) {
        // Register new user
        // Emit new message in 'online users' channel
        // that a new user was registered
        console.log(socket.id.toString() + ' connected');
        io.emit('chat message', 'Hi and welcome to PIIG chat service!');
        socket.on('chat message', function (msg) {
            console.log(socket.id.toString() + ' sent message: ' + msg);
            socket.broadcast.emit('chat message', socket.id.toString() + ': ' + msg);
        });
        // Define disconnect behavior
        socket.on('disconnect', function () {
            console.log('session ' + socket.id.toString() + ' disconnected');
        });
    };
    return WebSocketBroker;
}());
exports.WebSocketBroker = WebSocketBroker;
