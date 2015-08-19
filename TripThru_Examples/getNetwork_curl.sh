#!/bin/sh

companyIdTemplate=`node useHelpers.js getCompanyIdTemplate`
companyTokenValue=`node useHelpers.js getCompanyTokenValue`
companyKeyFile=`node useHelpers.js getCompanyKeyFile`
companyCertFileAndPass=`node useHelpers.js getCompanyCertFileAndPass`



TMPFILE=`mktemp /tmp/example.XXXXXXXXXX` || exit 1

rm -f $TMPFILE

curl -s -S -k --key $companyKeyFile --cert $companyCertFileAndPass -H "Content-Type: application/json" -X  GET https://api.sandbox.tripthru.com/network/$companyIdTemplate?token=$companyTokenValue > $TMPFILE

echo "Configuration Information: " 

node prettyPrint.js $TMPFILE

rm -f $TMPFILE



