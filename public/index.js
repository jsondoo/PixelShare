var pixels = [];
var canvas;
var scl;

var socket;

function setup() {
    scl = Math.floor(windowWidth/300);
    left_over = windowWidth - 300*scl;
    canvas = createCanvas(windowWidth,windowHeight);
    canvas.position(left_over/2,0);
    canvas.style('z-index', '-1');
    background(0);

    socket = io.connect('http://localhost:3000');
    socket.on('state', get_state);
    socket.on('fill_pixel', update_pixel);
    stroke(255,255,255);
    noStroke();
    noFill();




    frameRate(10);

}

function draw() {

    fill(255,0,0);
    rect(100, 100, 100, 100);

    for (var i = 0; i < pixels.length; i++) {
        var row = pixels[i];
        for (var j = 0; j < row.length; j++) {
            var pixel = row[j];
            fill(pixel['r'],pixel['g'],pixel['b']);
            rect(j*scl, i*scl, scl, scl);
        }
  }
}

function update_pixel(update) {
    console.log('UPDATE PIXEL');
    var row = update['y'];
    var col = update['x'];

    var r = update['r'];
    var g = update['g'];
    var b = update['b'];

    pixels[row][col] = [r,g,b];
}

function get_state(data) {
    console.log('GET STATE');
    pixels = data;
}

function mouseClicked() {
    console.log('MOUSE PRESSED');
    r = g = b = 0;
    col = Math.floor(mouseX/scl);
    row = Math.floor(mouseY/scl);
    socket.emit('send_pixel_update',
        {
            'x' : col, 'y' : row,
            'r' : r, 'g' : g, 'b' : b
        }
    );
}
