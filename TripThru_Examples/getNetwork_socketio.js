
// getNetwork_socketio.js

var io = require('socket.io-client');
var querystring = require('querystring');

// get local helper functions
var helpers = require('./helpers.js');

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

var companyIdJSON = helpers.getCompanyIdJSON();

socket.emit('get-network-info', companyIdJSON, function(response){
    console.log(JSON.stringify(response, null, '    '));
    console.log("disconnecting...");
    socket.disconnect();
    process.exit(1);
});

