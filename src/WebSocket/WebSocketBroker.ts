'use strict';
import * as uWebSockets from 'uWebSockets.js';
import upgradeEvent from './Event/Upgrade';
import openEvent from './Event/Open';
import messageEvent from './Event/Message';
import drainEvent from './Event/Drain';
import closeEvent from './Event/Close';

export default function webSocketSetup(app) {

app.ws('/chatPortal', 
    { 
        compression: uWebSockets.SHARED_COMPRESSOR,
        maxPayloadLength: 16 * 1024 * 1024,
        idleTimeout: 100,

        /*
         * Upgrade socket event
         */
        upgrade: upgradeEvent,

        /*
         * Open socket event
         */
        open: openEvent,

        /*
         * Message socket event for
         * messages received
         */
        message: messageEvent,

        /*
         * Drain event used in 
         * handling backpressure
         */
        drain: drainEvent,

        /*
         * Close socket event.
         * No messages can be handled 
         * when this event is triggered.
         *
         * An error is triggered if attempt
         * is made to use the socket connection
         */
        close: closeEvent
    }
)
    return app;
}
