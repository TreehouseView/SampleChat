'use strict';
exports.__esModule = true;
function drainEvent(ws) {
    console.log('Websocket backpressure: ' + ws.getBufferedAmount);
}
exports["default"] = drainEvent;
