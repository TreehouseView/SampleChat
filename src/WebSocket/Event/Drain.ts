'use strict';

export default function drainEvent(ws) {
    console.log('Websocket backpressure: ' + ws.getBufferedAmount);
}
