
// this code will read the first argument on the command line and pretty print it
// this code has no error handling, so it is fragile, but it works!

// example use:
// node prettyPrint.js filename.js

var fs = require('fs');
//console.log(process.argv[2]);

if (typeof process.argv[2] == "undefined"){
    console.log("prettyPrint.js cannot find filename to process");
    process.exit(-1);
}


var obj = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
var objStringified = JSON.stringify(obj, null, '    ');

console.log(objStringified);
