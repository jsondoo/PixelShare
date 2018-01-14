var express = require('express')
var app = express();
var server = app.listen(process.env.PORT || 3000);

var DIM = 300;

app.use(express.static('public'));
var io = require('socket.io')(server);

var grid = create_grid();
var ips = {};
io.sockets.on('connection', new_connection);

function new_connection(socket) {
    socket.emit('state', grid);
    socket.on('send_pixel_update', function update_pixel(pixel) {
        x = pixel.x;
        y = pixel.y;
        if (x < 0 || y < 0 || x >= DIM || y >= DIM) return;
        grid[x][y] = {
            'r': pixel.r,
            'g': pixel.g,
            'b': pixel.b
        };
        ips[socket.id] = Date.now();
        io.emit('fill_pixel', pixel);
    });
}

function create_grid() {
    var grid = [];
    for(i = 0; i < DIM; i++) {
        grid[i] = new Array(DIM).fill({
            'r': 255,
            'g': 255,
            'b': 255
        });
    }
    return grid;
}
