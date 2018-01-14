var pixels = [];
var canvas;
var scl;

var socket;

function setup() {
    scl = Math.floor(windowWidth/300);
    canvas = createCanvas(windowWidth,windowHeight);
    canvas.parent("canvas-holder")
    canvas.position(0,0);
    canvas.style('z-index', '-1');
    background(125);

    socket = io.connect('http://localhost:3000');
    socket.on('state', get_state);
    socket.on('fill_pixel', update_pixel);
    stroke(255,255,255);
    noStroke();
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
    r = g = b = 0;
    col = Math.floor(mouseX/scl);
    row = Math.floor(mouseY/scl);
    pixels[row][col] = {'r':r,'g':g,'b':b};
    socket.emit('send_pixel_update',
        {
            'x' : col, 'y' : row,
            'r' : r, 'g' : g, 'b' : b
        }
    );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for (var i = 0; i < pixels.length; i++) {
      var row = pixels[i];
      for (var j = 0; j < row.length; j++) {
          var pixel = row[j];
          fill(pixel['r'],pixel['g'],pixel['b']);
          rect(j*scl, i*scl, scl, scl);
      }
  }
}
