var express = require('express')
var app = express();
var server = app.listen(process.env.PORT || 3000);

app.use(express.static('public'));
var io = require('socket.io')(server);


io.sockets.on('connection', newConnection);

function newConnection(socket) {
    socket.emit('state', gridPixels);
}




