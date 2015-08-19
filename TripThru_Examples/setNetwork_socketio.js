
// setNetwork_socketio.js

var io = require('socket.io-client');
var querystring = require('querystring');
var moment = require('moment');
var fs = require('fs');

// get local helper functions
var helpers = require('./helpers.js');

// test for file on command line
if (typeof process.argv[2] == "undefined"){
    console.log("setNetwork_socketio.js cannot find filename to use");
    console.log("try: \nnode setNetwork_socketio.js templates/tt_network_post_for_socketio.js");
    process.exit(-1);
}

var obj = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
var objStringified = JSON.stringify(obj, null, '    ');

// get the company connection/token
var connectionJSON = helpers.getConnectionJSON();

var socket = io.connect( 'https://api.sandbox.tripthru.com/', connectionJSON);

socket.on('connect', function (){
    console.log('connected!');
});

socket.on('error', function (data){
    console.log('error!');
    console.log(JSON.stringify(data, null, '     '));
    process.exit(1);
});

socket.on('disconnect', function (){
    console.log('disconnected!');
});

socket.on('connect_failed', function (data){
    console.log('connect_failed!');
});

socket.on('reconnect_attempt', function (data){
    console.log('reconnect_attempt!');
});

socket.on('connect_timeout', function (data){
    console.log('connect_timeout!');
});

socket.on('reconnect_failed', function (data){
    console.log('reconnect_failed!');
});

//socket.emit('set-network-info', JSON.stringify(obj), function(response){
socket.emit('set-network-info', obj, function(response){
    console.log("sent: \n" + objStringified);
    //console.log(response);
    console.log("result:");
    console.log(JSON.stringify(response, null, '    '));
    console.log("disconnecting...");
    socket.disconnect();
    process.exit(1);
});

