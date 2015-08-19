
// This javascript helper will take a template file and update it with a new time that is 5 minutes in the future 
// it will write the file out to templates/tt_trip_request_now.js

var moment = require('moment');
var fs = require('fs');

var outputTripRequestFile = "templates/tt_trip_request_now.js";

// test for file on command line
if (typeof process.argv[2] == "undefined"){
    console.log("makeTrip_helper.js cannot find filename to process");
    process.exit(-1);
}

var obj = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
obj.pickup_time = moment().add(5,'minutes').utc().format();

var objStringified = JSON.stringify(obj, null, '    ');

//console.log(objStringified);

fs.writeFile(outputTripRequestFile, objStringified, function (err) {
    if (err) {
        return console.log(err);
    }

    console.log("created: " +  outputTripRequestFile);
});
