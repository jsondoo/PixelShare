var pixels = [];
var canvas;
var scl;
var r;
var g;
var b;

var last_access_time;

var socket;

function setup() {
    scl = Math.floor(displayWidth/300);
    r = g = b = 0;
    canvas = createCanvas(displayWidth,displayHeight);
    canvas.parent("canvas-holder")
    // canvas.position(0,0);
    canvas.style('z-index', '-1');
    background(125);

    socket = io.connect('http://localhost:3000');
    socket.on('state', get_state);
    socket.on('fill_pixel', update_pixel);
    socket.on('timer', update_timer);

    stroke(255,255,255);
    noStroke();
}

function update_timer(wait_time) {
    
}

function update_pixel(update) {
    console.log('UPDATE PIXEL');
    var row = update['y'];
    var col = update['x'];

    var r = update['r'];
    var g = update['g'];
    var b = update['b'];

    pixels[row][col] = {'r':r,'g':g,'b':b};

    fill(r,g,b);
    rect(col*scl, row*scl, scl, scl);
}

function get_state(data) {
    console.log('GET STATE', data);
    pixels = data;

    for (var i = 0; i < pixels.length; i++) {
        var row = pixels[i];
        for (var j = 0; j < row.length; j++) {
            var pixel = row[j];
            fill(pixel['r'],pixel['g'],pixel['b']);
            rect(j*scl, i*scl, scl, scl);
        }
    }
}

function mouseClicked() {
    console.log('MOUSE PRESSED', mouseX, mouseY);
    console.log('Color', r, g, b);
    col = Math.floor(mouseX/scl);
    row = Math.floor(mouseY/scl);
    socket.emit('send_pixel_update',
        {
            'x' : col, 'y' : row,
            'r' : r, 'g' : g, 'b' : b
        }
    );
}

function windowResized() {
    console.log('WINDOW RESIZED');
    resizeCanvas(displayWidth, displayHeight);
    for (var i = 0; i < pixels.length; i++) {
      var row = pixels[i];
      for (var j = 0; j < row.length; j++) {
          var pixel = row[j];
          fill(pixel['r'],pixel['g'],pixel['b']);
          rect(j*scl, i*scl, scl, scl);
      }
    }
}

// called when a button is clicked in color picker
function changeColour(hex){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0, hex.length/3), 16);
    g = parseInt(hex.substring(hex.length/3, 2*hex.length/3), 16);
    b = parseInt(hex.substring(2*hex.length/3, 3*hex.length/3), 16);
  }
