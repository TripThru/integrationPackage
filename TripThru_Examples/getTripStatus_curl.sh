#!/bin/sh

# this will get the status of an existing trip, it uses the tripid file 

companyIdTemplate=`node useHelpers.js getCompanyIdTemplate`
companyTokenValue=`node useHelpers.js getCompanyTokenValue`
tripid=`node useHelpers.js getTripid`
companyKeyFile=`node useHelpers.js getCompanyKeyFile`
companyCertFileAndPass=`node useHelpers.js getCompanyCertFileAndPass`


TMPFILE=`mktemp /tmp/example.XXXXXXXXXX` || exit 1

rm -f $TMPFILE

echo "Getting trip status of: $tripid"

curl -s -S  -k --key $companyKeyFile --cert $companyCertFileAndPass -H "Content-Type: application/json" -X   GET https://api.sandbox.tripthru.com/tripstatus/$tripid?token=$companyTokenValue > $TMPFILE

node prettyPrint.js $TMPFILE

rm -f $TMPFILE

