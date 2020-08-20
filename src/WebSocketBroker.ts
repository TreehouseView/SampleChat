'use strict';

export class WebSocketBroker {

    private nanoClient: null;

    public constructor(nanoClient) {
        this.nanoClient = nanoClient;
    }

    public init(io, socket) {

        // Register new user

        // Emit new message in 'online users' channel
        // that a new user was registered
        
        console.log(socket.id.toString() + ' connected');
        io.emit('chat message', 'Hi and welcome to PIIG chat service!');
        
        socket.on('chat message', (msg) => {
            console.log(socket.id.toString() + ' sent message: ' + msg);
            socket.broadcast.emit('chat message',socket.id.toString() + ': ' +  msg);
        });
        
        // Define disconnect behavior
        socket.on('disconnect', () => {
            console.log('session ' + socket.id.toString() + ' disconnected');
        });
    }

}
