'use strict';
exports.__esModule = true;
function messageEvent(ws, messageBuffer, isBinary) {
    // If not binary, assume text
    if (!isBinary) {
        console.log('message not binary');
        var rawMessage = String.fromCharCode.apply(null, new Uint8Array(messageBuffer));
        var message = null;
        try {
            message = JSON.parse(rawMessage);
            console.log('message received: ' + message.message_type);
        }
        catch (err) {
            message = rawMessage;
        }
        ;
        switch (message.message_type) {
            case 'login':
                // Register username to socket object
                ws.organization = {
                    company: {
                        name: 'treehouse'
                    },
                    user: {
                        id: 1234,
                        name: message.username
                    }
                };
                // Subscribe to the global channel.
                // This should represent the whole organization.
                // This channel is used to send system messages.
                // No discussion messages should be sent to this 
                // channel
                ws.subscribe('/' + ws.organization.company.name);
                ws.send(JSON.stringify({
                    message_type: 'member_list',
                    members: [
                        {
                            id: '1234wfa2q432rew',
                            username: 'Aileen',
                            email: ''
                        },
                        {
                            id: 'rj3q5hrefhlkalkre',
                            username: 'Jay',
                            email: ''
                        },
                        {
                            id: 'fjlk4hrakfhfdare',
                            username: 'Leslie',
                            email: ''
                        },
                        {
                            id: 'arwelasrhkwfhkjhwak4r',
                            username: 'Robert',
                            email: ''
                        }
                    ],
                    members_heartbeat: [
                        {
                            id: '1234wfa2q432rew',
                            last_ping: ''
                        },
                        {
                            id: 'rj3q5hrefhlkalkre',
                            last_ping: ''
                        },
                        {
                            id: 'fjlk4hrakfhfdare',
                            last_ping: ''
                        },
                        {
                            id: 'arwelasrhkwfhkjhwak4r',
                            last_ping: ''
                        }
                    ]
                }));
                console.log('Sending login message');
                ws.publish('/' + ws.organization.company.name, JSON.stringify({
                    message_type: 'user_login',
                    user_info: {
                        name: ws.organization.user.name,
                        id: '1234'
                    }
                }), false);
                break;
            case 'logout':
                ws.publish('/' + ws.organization.company.name, JSON.stringify({
                    message_type: 'user_logout',
                    user_info: ws.organization.user
                }), false);
                ws.end(111111, JSON.stringify({ user: ws.organization.user }));
                break;
            case 'chat':
                console.log('message received from ' + ws.organization.user.name + ': ' + message.body);
                ws.publish('/' + message.topic, JSON.stringify({
                    message_type: 'chat',
                    source_name: ws.organization.user.name,
                    body: message.body,
                    topic: message.topic
                }), false);
                break;
            case 'channel_create':
                console.log('Creating channel: ' + message.name);
                ws.publish('/' + ws.organization.company.name, JSON.stringify({
                    message_type: 'channel_created',
                    name: message.name
                }), false);
                break;
            case 'select_channel':
                ws.subscribe('/' + message.topic);
                break;
            default:
                console.log('Unknown message type received: ' + message.message_type);
                break;
        }
    }
}
exports["default"] = messageEvent;
