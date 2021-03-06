var express = require('express')
var app = express();
var server = app.listen(8000);

var DIM = 200; // size of canvas
var WAIT_TIME = 5000 // time out period in milliseconds

app.use(express.static('public'));
var io = require('socket.io')(server);

// server-side variables
var grid = create_grid();
var access_times = {};
var users_online = 0;

io.sockets.on('connection', new_connection);

function new_connection(socket) {
    users_online++;
    io.emit('update_users_online', users_online);

    socket.emit('state', grid);
    socket.on('disconnect', function() { 
        users_online--;
        io.emit('update_users_online', users_online);
    }) 
    socket.on('send_pixel_update', function update_pixel(pixel) {
        x = pixel.x;
        y = pixel.y;
        if (x < 0 || y < 0 || x >= DIM || y >= DIM) return;
        var socket_id = socket.request.connection.remoteAddress;
        var time = Date.now();
        if (access_times[socket_id] != undefined && (time - access_times[socket_id] < WAIT_TIME)) return;//4.95*MIN_TO_MILLISEC)) return;
        io.emit('fill_pixel', pixel);
        grid[y][x] = {
            'r': pixel.r,
            'g': pixel.g,
            'b': pixel.b
        };
        socket.emit('timer', WAIT_TIME);
        access_times[socket_id] = time
    });
}

function create_grid() {
    var grid = [];
    for(i = 0; i < DIM; i++) {
        // initially start with all white pixels
        grid[i] = new Array(DIM).fill({
            'r': 255,
            'g': 255,
            'b': 255
        });
    }
    return grid;
}
