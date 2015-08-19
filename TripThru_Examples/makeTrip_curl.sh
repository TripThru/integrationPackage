#!/bin/sh

companyIdTemplate=`node useHelpers.js getCompanyIdTemplate`
companyTokenValue=`node useHelpers.js getCompanyTokenValue`
companyKeyFile=`node useHelpers.js getCompanyKeyFile`
companyCertFileAndPass=`node useHelpers.js getCompanyCertFileAndPass`


# must have the source (template) filename on the command line

# test for filename on command line
if [ $# -ge 1 ];
then
    FILE=$1

    # test if file exists
    if [ -f $FILE ];
    then
        # increment the tripnum and the the tripid
        incrementOutput=`node useHelpers.js incrementTripCountNum`
        tripid=`node useHelpers.js getTripid`

        echo "Building trip request $tripid from file: $FILE"

        # call the makeTrip_helper to make the trip request JSON
        # the output of this call will be to create this file: templates/tt_trip_request_now.js
        node makeTrip_helper.js $FILE

        TMPFILE=`mktemp /tmp/example.XXXXXXXXXX` || exit 1

        rm -f $TMPFILE

        # call curl to send the trip request
        curl -s -S -k --key $companyKeyFile --cert $companyCertFileAndPass -H 'Content-Type: application/json' -X  POST -d @templates/tt_trip_request_now.js https://api.sandbox.tripthru.com/trip/$tripid?token=$companyTokenValue > $TMPFILE

        echo "Result: " 

        node prettyPrint.js $TMPFILE

        rm -f $TMPFILE

    else
        echo "File $FILE does not exist."
    fi
else
    echo "no file provided on command line, exiting."
    echo "try: "
    echo "./makeTrip_curl.sh templates/tt_trip_request_SF.js"
fi


