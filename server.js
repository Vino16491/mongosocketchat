const mongo = requrie('mongodb').MongoClient;
const ioClient = require('socket.io').listen(4000).sockets;

// connect to mongoDB

mongo.connect('mongodb://127.0.0.1/mongochat', function(err, db){
    if(err){
        console.log(err);
        throw err;
    }

    console.log('Mongodb Connected');
});

