
// useHelpers.js
// this routine was written to allow the cURL scripts to use the same configuration information that the socket.io uses
// it allows a shell script to call a helper.js function to get companyId or tripid
// this will minimize the amount of configuration someone will have to do when using these examples

var fs = require('fs');

// get local helper functions
var helpers = require('./helpers.js');

// This script will access a helper function based on the operation requested on the command line
// output should be captured by the calling script

// test for request on command line
if (typeof process.argv[2] == "undefined"){
    console.log("useHelpers.js cannot find request to process");
    console.log("try: \nnode useHelpers.js getTripid");
    process.exit(-1);
}

// get the company connection/token
if (process.argv[2] == "getTripid"){
    var currentTripid = helpers.getTripId();
    console.log(currentTripid);
    process.exit(1);
};

// increment trip count
if (process.argv[2] == "incrementTripCountNum"){
    helpers.incrementTripCountNum();
    console.log("done");
    process.exit(1);
};

// get token value
if (process.argv[2] == "getCompanyTokenValue"){
    var companyTokenValue = helpers.getCompanyTokenValue();
    console.log(companyTokenValue);
    process.exit(1);
};

// get company key file
if (process.argv[2] == "getCompanyKeyFile"){
    var companyKeyFile = helpers.getCompanyKeyFile();
    console.log(companyKeyFile);
    process.exit(1);
};

// get company certificate and password 
if (process.argv[2] == "getCompanyCertFileAndPass"){
    var companyCertFileAndPass = helpers.getCompanyCertFileAndPass();
    console.log(companyCertFileAndPass);
    process.exit(1);
};

// get connection JSON 
if (process.argv[2] == "getConnectionJSON"){
    var getConnectionJSON = helpers.getConnectionJSON();
    console.log(JSON.stringify(getConnectionJSON,null,"    "));
    process.exit(1);
};

// get company id template
if (process.argv[2] == "getCompanyIdTemplate"){
    var companyIdTemplate = helpers.getCompanyIdTemplate();
    console.log(companyIdTemplate);
    process.exit(1);
};

console.log("useHelpers.js failed to find an command to operate");
process.exit(-1);
