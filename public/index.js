var pixels = [];
var canvas;
var scl;

var socket;

function setup() {
  canvas = createCanvas(windowWidth,windowHeight + 100);
  canvas.position(0,0);
  canvas.style('z-index', '-1');
  background(0);

  socket = io.connect('http://localhost:3000');

  stroke(255,255,255);
  strokeWeight(4);
  noFill();

  scl = 20;

  frameRate(10);

}

function draw() {

  rect(100, 100, 100, 100);

  for (var i = 0; i < pixels.length; i++) {
      var row = pixels[i];
      for (var j = 0; j < row.length; j++) {
          var pixel = row[j];
          stroke(pixel[0],pixel[1],pixel[2]);
          rect(j*scl, i*scl, scl, scl);
      }
  }
}


function onMousePressed() {

}
