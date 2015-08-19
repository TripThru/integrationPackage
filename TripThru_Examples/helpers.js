
// helpers.js

// contains helper functions

var querystring = require('querystring');
var fs = require('fs');
var https = require('https');

var tripid_file = "data/tripid";
var companyIdTemplate = "@tripthru.com";
var companyKeyFile = ".key";
var companyCrtFile = ".crt";
var companyPassphrase = "";
var companyCertFileAndPass = companyCrtFile + ":" + companyPassphrase;
var companyTokenValue = "";
var companyTokenJSON = {"token": companyTokenValue};

// use replace : true if your connection is somehow locked up, it allows you to re-use an existing connection
//var companyTokenJSON = {"token": "will_be_replaced_with_companyTokenValue", "replace" : true};

// -----------------------
//  Helper functions
// -----------------------
// get companyId in JSON 
var getCompanyIdJSON = function(){
    return({"id":companyIdTemplate});
};

// get company token value
var getCompanyTokenValue = function() {
    return(companyTokenValue);
};

// get company key file
var getCompanyKeyFile = function() {
    return(companyKeyFile);
};

// get company certificate file and password
var getCompanyCertFileAndPass = function() {
    return(companyCertFileAndPass);
};

// get the fully updated company token
var getCompanyTokenJSON = function() {
    var updatedCompanyTokenJSON = companyTokenJSON;
    updatedCompanyTokenJSON.token = getCompanyTokenValue();
    return(updatedCompanyTokenJSON);
};

// get the connection JSON
var getConnectionJSON = function(){
    https.globalAgent.options.rejectUnauthorized = false;
    https.globalAgent.options.cert = fs.readFileSync(companyCrtFile);
    https.globalAgent.options.key = fs.readFileSync(companyKeyFile);
    https.globalAgent.options.passphrase = companyPassphrase;
    var connectionJSON = {  "forceNew": true,
                            "query": querystring.stringify(getCompanyTokenJSON()),
                            "transports": ['websocket'],
                            agent: https.globalAgent,
                            secure: true
                        };
    return(connectionJSON);
};

// get trip count num
var getTripCountNum = function(){
    var count = Number(fs.readFileSync(tripid_file, 'utf8'));
    return(count);
};

// increment trip count num
var incrementTripCountNum = function(){
    var count = getTripCountNum();
    count++;
    var countStringified = count.toString();
    fs.writeFileSync(tripid_file, countStringified);
};

var getCompanyIdTemplate = function() {
    return(companyIdTemplate);
};

// make a tripid using a provided number
var makeTripId = function(count){
    var countStringified = count.toString();
    var tripidString = countStringified+"@"+companyIdTemplate;
    return(tripidString);
};

// get current trip id 
var getTripId = function(){
    var count = getTripCountNum();
    var tripidString = makeTripId(count);
    return(tripidString);
};


// export list
exports.getCompanyIdJSON = getCompanyIdJSON;
exports.getCompanyIdTemplate = getCompanyIdTemplate;
exports.getCompanyKeyFile = getCompanyKeyFile;
exports.getCompanyCertFileAndPass = getCompanyCertFileAndPass;
exports.getCompanyTokenValue = getCompanyTokenValue;
exports.getCompanyTokenJSON = getCompanyTokenJSON;
exports.getConnectionJSON = getConnectionJSON;
exports.getTripCountNum = getTripCountNum;
exports.incrementTripCountNum = incrementTripCountNum;
exports.getTripId = getTripId;
exports.makeTripId = makeTripId;

