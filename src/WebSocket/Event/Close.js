'use strict';
exports.__esModule = true;
function closeEvent(ws, code, message) {
    console.log('Websocket closed for ' + ws.organization.user.name);
}
exports["default"] = closeEvent;
