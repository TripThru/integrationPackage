

EXplain configure for curl stuff here.....


Example runthrough:

On your AWS server Make two shells:

1) The first shell will be used to configure the TripThru server, initiate a trip and finally pay for it.
(called interacive shell in instructions)

2) The second shell will be used to launch the mini web-server.   This mini-server will monitor the trip and output trip status events.
(called mini-server shell in instructions)


Steps:

A) Send your configure information to the TripThru server (interactive shell)
[ the most important thing in this configuration as compared to the socket.io configuration is the use of the "callback_url" which is for restful only ]

% ./setNetwork_curl.sh 
Sending this configuration to TripThru
{
    "name": "Fabless",
    "callback_url": "http://ec2-54-200-100-15.us-west-2.compute.amazonaws.com",
    "products": [
        {
            "id": "Fabless Los Angeles",
            "name": "Fabless Los Angeles",
            "image_url": "http://www.tripthru.com/assets/networks/fabless@tripthru.com.png",
            "accepts_prescheduled": true,
            "accepts_ondemand": true,
            "accepts_cash_payment": true,
            "accepts_account_payment": true,
            "accepts_creditcard_payment": true,
            "coverage": {
                "radius": 50,
                "center": {
                    "lat": 34.0494,
                    "lng": -118.242
                }
            }
        },
        {
            "id": "Fabless New York",
            "name": "Fabless New York",
            "image_url": "http://www.tripthru.com/assets/networks/fabless@tripthru.com.png",
            "accepts_prescheduled": true,
            "accepts_ondemand": true,
            "accepts_cash_payment": true,
            "accepts_account_payment": true,
            "accepts_creditcard_payment": true,
            "coverage": {
                "radius": 50,
                "center": {
                    "lat": 40.6711,
                    "lng": -73.9404
                }
            }
        }
    ]
}
Result:
{
    "result_code": 200,
    "result": "OK"
}

B) Request the configuration from TripThru so you can verify it (interactive shell)
[ the returned configuration will not provide the callback_url because it is private information ]

% ./getNetwork_curl.sh 
Configuration Information: 
{
    "name": "Fabless",
    "products": [
        {
            "name": "Fabless Los Angeles",
            "image_url": "http://www.tripthru.com/assets/networks/fabless@tripthru.com.png",
            "accepts_prescheduled": true,
            "accepts_ondemand": true,
            "accepts_cash_payment": true,
            "accepts_account_payment": true,
            "accepts_creditcard_payment": true,
            "coverage": {
                "radius": 50,
                "center": {
                    "lat": 34.0494,
                    "lng": -118.242
                }
            }
        },
        {
            "name": "Fabless New York",
            "image_url": "http://www.tripthru.com/assets/networks/fabless@tripthru.com.png",
            "accepts_prescheduled": true,
            "accepts_ondemand": true,
            "accepts_cash_payment": true,
            "accepts_account_payment": true,
            "accepts_creditcard_payment": true,
            "coverage": {
                "radius": 50,
                "center": {
                    "lat": 40.6711,
                    "lng": -73.9404
                }
            }
        }
    ]
}


C) Now that the configuration is in place, in your second shell start up the mini-server (mini-server shell)

% node mini-server.js
[ You will see the string "test" show up once a minute, this is because on some networks the 
connection may be closed if there is no activity.  This heartbeat "test" output keeps the connection open. ]
Node app is running at localhost:8080
test
...


D) Make trip request (interactive shell)
[ the makeTrip_curl.sh will take a template file and update it with a unique tripid and a time of 5 minutes in the future 
and write it out to the file templates/tt_trip_request_now.js so you can review it at any time ]

% ./makeTrip_curl.sh templates/tt_trip_request_SF.js
Building trip request from file: templates/tt_trip_request_SF.js
created: templates/tt_trip_request_now.js
Result:
{
    "result_code": 200,
    "result": "OK"
}

E) View mini-server activity, you should see the "status" of the trip changing as the trip is underway (mini-server shell)

PUT /tripstatus/:id
id is: 1280@fabless@tripthru.com
{
    "id": "1280@fabless@tripthru.com",
    "client_id": "curb@tripthru.com",
    "status": "accepted",
    "product": {
        "id": "CurbSanFrancisco",
        "name": "Curb San Francisco",
        "image_url": "http://www.tripthru.com/assets/networks/curb@tripthru.com.png"
    },
    "eta": "2015-04-29T21:22:07+00:00",
    "driver": {
        "name": "Carl 393",
        "location": {
            "lat": 37.769996,
            "lng": -122.447329
        }
    }
}
PUT /tripstatus/:id
id is: 1280@fabless@tripthru.com
{
    "id": "1280@fabless@tripthru.com",
    "client_id": "curb@tripthru.com",
    "status": "en_route",
    "product": {
        "id": "CurbSanFrancisco",
        "name": "Curb San Francisco",
        "image_url": "http://www.tripthru.com/assets/networks/curb@tripthru.com.png"
    },
    "eta": "2015-04-29T21:19:29+00:00",
    "driver": {
        "name": "Carl 393",
        "location": {
            "lat": 37.769996,
            "lng": -122.447329
        }
    }
}
PUT /tripstatus/:id
id is: 1280@fabless@tripthru.com
{
    "id": "1280@fabless@tripthru.com",
    "client_id": "curb@tripthru.com",
    "status": "picked_up",
    "product": {
        "id": "CurbSanFrancisco",
        "name": "Curb San Francisco",
        "image_url": "http://www.tripthru.com/assets/networks/curb@tripthru.com.png"
    },
    "eta": "2015-04-29T21:21:07+00:00",
    "driver": {
        "name": "Carl 393",
        "location": {
            "lat": 37.771561,
            "lng": -122.442372
        }
    }
}
PUT /tripstatus/:id
id is: 1280@fabless@tripthru.com
{
    "id": "1280@fabless@tripthru.com",
    "client_id": "curb@tripthru.com",
    "status": "completed",
    "product": {
        "id": "CurbSanFrancisco",
        "name": "Curb San Francisco",
        "image_url": "http://www.tripthru.com/assets/networks/curb@tripthru.com.png"
    },
    "eta": "2015-04-29T21:21:07+00:00",
    "driver": {
        "name": "Carl 393",
        "location": {
            "lat": 37.77133,
            "lng": -122.43534
        }
    }
}
POST /payment/:id
id is: 1280@fabless@tripthru.com
{
    "id": "1280@fabless@tripthru.com",
    "client_id": "tripthru",
    "fare": 4.36080291048,
    "currency_code": "USD"
}




F) Once you see the POST payment request in the mini-server return to your interactive shell and confirm payment (interactive shell)
% ./putPayment_curl.sh 
{
    "result_code": 200,
    "result": "OK"
}



NOTES:

If your keys are not working when attempting the curl examples, you may find it helpful 
to change file ownership and permissions.

(example below uses the files: fabless_client.crt fabless_client.key - your filenames will be different)

sudo chown ubuntu:ubuntu fabless_client.crt fabless_client.key
chmod 644 fabless_client.crt fabless_client.key

