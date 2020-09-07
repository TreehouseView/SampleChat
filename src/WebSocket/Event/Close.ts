'use strict';

export default function closeEvent(ws, code, message) {
    console.log('Websocket closed for ' + ws.organization.user.name);
}
