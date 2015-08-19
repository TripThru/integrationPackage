#!/bin/sh

TMPFILE=`mktemp /tmp/example.XXXXXXXXXX` || exit 1

companyIdTemplate=`node useHelpers.js getCompanyIdTemplate`
companyTokenValue=`node useHelpers.js getCompanyTokenValue`
companyKeyFile=`node useHelpers.js getCompanyKeyFile`
companyCertFileAndPass=`node useHelpers.js getCompanyCertFileAndPass`


echo "Sending this configuration to TripThru"

node prettyPrint.js ./templates/tt_network_post_for_curl.js

rm -f $TMPFILE

curl -s -S -k --key $companyKeyFile --cert $companyCertFileAndPass -H "Content-Type: application/json" -X  POST -d @./templates/tt_network_post_for_curl.js \
https://api.sandbox.tripthru.com/network?token=$companyTokenValue   > $TMPFILE

echo "Result:"

node prettyPrint.js $TMPFILE

rm -f $TMPFILE



