const mongo = require('mongodb').MongoClient;
const ioClient = require('socket.io').listen(4000).sockets;

// connect to mongoDB

mongo.connect('mongodb://127.0.0.1/mongochat', function (err, db) {
    if (err) {
        console.log(err);
        throw err;
    }

    console.log('Mongodb Connected');

    // connect to socket

    ioClient.on('connection', function () {
        let chat = db.collection('chats');

        //Create function to send status
        sendStatus = function (s) {
            socket.emit('status', s);
        }

        // get chat from mongo collection
        chat.find().limit(100).sort({
            _id: 1
        }).toArray(function (err, res) {
            if (err) {
                throw err;
            }

            // Emit Messages
            socket.emit('output', res);
        });

        // Handle input events
        socket.on('input', function (data) {
            let name = data.name;
            let message = data.message;

            // check for messages

            if (name == '' || message == '') {
                //send status
                sendStatus('please enter a message');
            } else {
                // insert variable to database
                chat.insert({
                    name: name,
                    message: message
                }, function () {
                    client.emit('output', [data]);

                    // send status object

                    sendstatus({
                        message: 'Message sent',
                        clear: true
                    });
                });

                // Handle clear
                socket.on('clear', function(data){
                    // Remove all chats from collection
                    chat.remove({}, function(){
                        // Emit cleared
                        socket.emit('cleared');
                    })
                })
            }
        })
    })
});