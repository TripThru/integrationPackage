#!/bin/sh

# this will pay for an existing trip, it uses the tripid file

companyIdTemplate=`node useHelpers.js getCompanyIdTemplate`
companyTokenValue=`node useHelpers.js getCompanyTokenValue`
tripid=`node useHelpers.js getTripid`
companyKeyFile=`node useHelpers.js getCompanyKeyFile`
companyCertFileAndPass=`node useHelpers.js getCompanyCertFileAndPass`



#TRIPID_FILE="data/tripid"
#
## test for tripid file, we will quit if this isn't available
#if [ -f $TRIPID_FILE ];
#then
#    TRIPID=$(cat "$TRIPID_FILE")
#else
#    echo "expected tripid file at: $TRIPID_FILE"
#    echo "file does not exist, exiting."
#    exit -1
#fi

TMPFILE=`mktemp /tmp/example.XXXXXXXXXX` || exit 1

rm -f $TMPFILE

echo "Sending simple payment info JSON to TripThru for tripid $tripid:"

node prettyPrint.js templates/payment.js

curl -s -S  -k --key $companyKeyFile --cert $companyCertFileAndPass -H "Content-Type: application/json" -X   PUT -d @templates/payment.js https://api.sandbox.tripthru.com/payment/$tripid?token=$companyTokenValue > $TMPFILE

echo "Result:"

node prettyPrint.js $TMPFILE

rm -f $TMPFILE

