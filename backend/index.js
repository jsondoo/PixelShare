var express = require('express');
var app = express();
var server = app.listen('3000')
var io = require('socket.io').listen(
