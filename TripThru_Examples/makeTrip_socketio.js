
// makeTrip_socketio.js

var io = require('socket.io-client');
var querystring = require('querystring');
var moment = require('moment');
var fs = require('fs');

// get local helper functions
var helpers = require('./helpers.js');

// This script does:
// read a template JSON file (that is specified on command line) 
// read the tripid file to get the most recent trip id used

// increment the tripid value (by 1) and write the new value back out into the tripid file
// use the newly updated tripid value along with the companyIdTemplate to create a unique tripid 

// put the tripid in into the template JSON
// put a new time that is 5 minutes in the future (from now) into the template JSON 

// write the file out to templates/tt_trip_request_now.js (for reference), it will also be sent to TripThru to request a trip

var outputTripRequestFile = "templates/tt_trip_request_now.js";

// test for file on command line
if (typeof process.argv[2] == "undefined"){
    console.log("makeTrip_socketio.js cannot find filename to process");
    console.log("try: \nnode makeTrip_socketio.js templates/tt_trip_request_LA.js");
    process.exit(-1);
}

// get the company connection/token
var connectionJSON = helpers.getConnectionJSON();

// read in the provided template file
var obj = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

// increment the tripid counter to prepare for a new trip request
helpers.incrementTripCountNum();

// update template with a current time and the unique tripid
obj.pickup_time = moment().add(5,'minutes').utc().format();
obj.id = helpers.getTripId();

var objStringified = JSON.stringify(obj, null, '    ');

// write out the finished outputTripRequestFile which we will also send to TripThru
fs.writeFile(outputTripRequestFile, objStringified, function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("created: " +  outputTripRequestFile);
});

var socket = io.connect( 'https://api.sandbox.tripthru.com/', connectionJSON);

socket.on('connect', function (){
    console.log('connected!');
});

socket.on('error', function (data){
    console.log('error!');
    console.log(JSON.stringify(data, null, '    '));
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

console.log("Sending a dispatch-trip request:");
console.log(JSON.stringify(obj, null, '    '));

socket.emit('dispatch-trip', obj, function(response){
    console.log("trip has been requested, disconnecting...");

    console.log("response:");
    console.log(JSON.stringify(response, null, '    '));

    console.log("disconnecting...");
    socket.disconnect();
    process.exit(1);
});

