var express = require('express')
var app = express();
var server = app.listen(process.env.PORT || 3000);

app.use(express.static('public'));
var io = require('socket.io')(server);

var grid = create_grid()
io.sockets.on('connection', new_connection);

function new_connection(socket) {
    console.log('asdf')
    socket.emit('state', grid);

    socket.on('send_pixel_update', update_pixel);
}

function update_pixel(pixel) {
    x = pixel.x
    y = pixel.y
    grid[x][y] = {
        'r': pixel.r,
        'g': pixel.g,
        'b': pixel.b
    }
}
function create_grid() {
    var grid = []
    for(i = 0; i < 300; i++){
        grid[i] = new Array(300).fill({
            'r': 247,
            'g': 33,
            'b': 9
        })
    }
}