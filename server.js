var express = require('express')
var app = express();
var server = app.listen(process.env.PORT || 3000);

app.use(express.static('public'));
var io = require('socket.io')(server);

var grid = create_grid()
io.sockets.on('connection', new_connection);

function new_connection(socket) {
    socket.emit('state', grid);
}

function create_grid() {
    for(i = 0; i < 300; i++){
        grid[i] = new Array(300).fill({
            'r': 255,
            'g': 255,
            'b': 255
        })
    }
}