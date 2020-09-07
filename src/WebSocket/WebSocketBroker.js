'use strict';
exports.__esModule = true;
var uWebSockets = require("uWebSockets.js");
var Upgrade_1 = require("./Event/Upgrade");
var Open_1 = require("./Event/Open");
var Message_1 = require("./Event/Message");
var Drain_1 = require("./Event/Drain");
var Close_1 = require("./Event/Close");
function webSocketSetup(app) {
    app.ws('/chatPortal', {
        compression: uWebSockets.SHARED_COMPRESSOR,
        maxPayloadLength: 16 * 1024 * 1024,
        idleTimeout: 100,
        /*
         * Upgrade socket event
         */
        upgrade: Upgrade_1["default"],
        /*
         * Open socket event
         */
        open: Open_1["default"],
        /*
         * Message socket event for
         * messages received
         */
        message: Message_1["default"],
        /*
         * Drain event used in
         * handling backpressure
         */
        drain: Drain_1["default"],
        /*
         * Close socket event.
         * No messages can be handled
         * when this event is triggered.
         *
         * An error is triggered if attempt
         * is made to use the socket connection
         */
        close: Close_1["default"]
    });
    return app;
}
exports["default"] = webSocketSetup;
