'use strict';
exports.__esModule = true;
function upgradeEvent(res, req, context) {
    console.log('Upgrade request: ' + req.getUrl());
    res.upgrade({
        url: req.getUrl()
    }, req.getHeader('sec-websocket-key'), req.getHeader('sec-websocket-protocol'), req.getHeader('sec-websocket-extensions'), context);
}
exports["default"] = upgradeEvent;
