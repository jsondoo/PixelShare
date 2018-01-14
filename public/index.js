var pixels = [];
var canvas;
var scl;
var r;
var g;
var b;
var width;
var height;

var last_access_time;

var socket;

function setup() {
    scl = Math.floor(displayWidth/300);
    r = g = b = 0;
    width = scl*300;
    canvas = createCanvas(width, width);
    canvas.parent("canvas-holder")
    // canvas.position(0,0);
    canvas.style('z-index', '-1');
    background(125);

    socket = io.connect('http://localhost:8000');
    socket.on('state', get_state);
    socket.on('fill_pixel', update_pixel);
    socket.on('timer', update_timer);

    stroke(255,255,255);
    noStroke();
}

function update_timer(wait_time) {
    // set initial time
    var distance = wait_time
    var minutes = Math.floor(distance / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById("time").innerHTML = minutes + "m " + seconds + "s ";

    // update timer every second
    var x = setInterval(function() {
        // grab current time remaining
        var distance = wait_time


        var minutes = Math.floor(distance / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById("time").innerHTML = minutes + "m " + seconds + "s ";
        console.log('called')
        distance -= 1000;

        // If the count down is finished, write some text
        if (distance <= 0) {
            clearInterval(x);
            document.getElementById("time").innerHTML = "Ready to click";
        } else {
        // update timer
            var minutes = Math.floor(distance / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            document.getElementById("time").innerHTML = minutes + "m " + seconds + "s ";
        }
    }, 1000);
}

function update_pixel(update) {
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
    resizeCanvas(width, height);
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
