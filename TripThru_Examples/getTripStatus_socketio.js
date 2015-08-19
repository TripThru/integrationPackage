
// getTripStatus.js

var io = require('socket.io-client');
var querystring = require('querystring');
var fs = require('fs');

// get local helper functions
var helpers = require('./helpers.js');

var exitAfterEmit = false;

// get  
var count = helpers.getTripCountNum();

var tripid = helpers.getTripId();

// check to see if we were provided the tripid number on the command line
// if so, we will use that instead of the number from the tripid_file
// and we will exit after making the call (one time request)
if (typeof process.argv[2] != "undefined"){
    console.log("making a single check for tripStatus");
    var count = Number(process.argv[2]);
    tripid = helpers.makeTripId(count);
    exitAfterEmit = true;
}

var tripidJSON = {"id":tripid};

var payForTripJSON = { 
                        "id": tripid,
                        "tip": {
                            "amount": 1,
                            "currency_code": "USD"
                        },
                        "confirmation": true
                     };


// Now we have the trip that we want to getStatus on.  Fire up the socket.io and 
// create some callbacks to handle messages
// The last call will make a request for trip status, if the id was provided on the command
// line, we will exit, otherwise we will stay connected and listen for all messages from tripthru
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

socket.on('connect_failed', function (){
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

socket.on('get-quote', function(data, cb){
    //console.log('got get-quote!');
    //console.log(JSON.stringify(data, null, '     '));
    cb({result_code: 430, result: 'rejected'});
});

socket.on('update-trip-status', function(data, cb){
    console.log('got update-trip-status!');
    console.log(JSON.stringify(data, null, '     '));
    cb({result_code: 200, result: 'ok'});
});

socket.on('request-payment', function(data, cb){
    cb({result_code: 200, result: 'ok'});

    console.log('got request-payment:');
    console.log(JSON.stringify(data, null, '     '));

    console.log('sending payment notfication via accept-payment:');

    console.log(JSON.stringify(payForTripJSON, null, '    '));
    socket.emit('accept-payment', payForTripJSON, function(response){
        console.log("response:");
        console.log(JSON.stringify(response, null, '    '));
        console.log("trip complete, exiting");
        console.log("disconnecting...");
        socket.disconnect();
        process.exit(1);
    });
});

socket.emit('get-trip-status', tripidJSON, function(response){
    console.log("Monitoring trip status for tripid: \n" + JSON.stringify(tripidJSON, null, '     '));
    console.log("response: ");
    console.log(JSON.stringify(response, null, '    '));
    if (exitAfterEmit){
        console.log("disconnecting...");
        socket.disconnect();
        process.exit(1);
    }
});

