

Describe socket.io example set:

If you have not already done so, please read, and follow the setup instructions in the README_FIRST.txt file
The README_FIRST.txt file will explain how to set and configure in preperation to using this example code.

You should be setup before using the socket.io examples, this includes getting the ssl keys and your secure token id from TripThru.

This file explains how to use the socket.io examples for TripThru API 

The example code which was written to demonstrate the API for anyone that would like some code that can exersize certian aspects of the API.


There are many files in this example pack, below are the files that are relevant to the socket.io examples:

The socket.io example scripts:

    <> == required argument
    [] == optional argument

    getDriversNearby_socketio.js <template/file.js>  - get drivers nearby       
    setNetwork_socketio.js       <template/file.sj>  - set network settings 
    getNetwork_socketio.js                           - get current network settings 
    getTripStatus_socketio.js    [tripnum]           - get trip status  (if optional tripnum is not supplied, the most recent tripnum will be used)
    makeTrip_socketio.js         <template/file.js>  - start a trip     

Other files and directories:
    config.json   - get node_modules
    ./data        - contains most recent tripnum value
    ./templates/  - contains files for setting socket.io network, getting drivers, make trip


1) TripThru needs to be configured for use for your network 

Use setNetwork_socketio.js to configure TripThru for your network and getNetwork_socketio.js to verify your TripThru configuration.

Use the templates/tt_network_post_for_socketio.js file when setting the Network configuration.

set/get network example usage and output:

% node setNetwork_socketio.js templates/tt_network_post_for_socketio.js
output:
connected!
sent: 
{
    "id": "fabless@tripthru.com",
    "name": "Fabless",
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
result:
{
    "result_code": 200,
    "result": "OK"
}
disconnecting...
disconnected!


2) You should verify that TripThru has your configuration information:

% node getNetwork_socketio.js 
output:
connected!
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
disconnecting...
disconnected!



3) Get nearby drivers - this is a single emit call to TripThru, which exits after a response is received

% node getDriversNearby_socketio.js templates/tt_request_driversnearby_SF.js
output:
Requesting info on nearby drivers with: 
{
    "limit": 5,
    "radius": 15,
    "location": {
        "lat": 37.771561,
        "lng": -122.442372
    }
}
connected!
response:
{
    "result_code": 200,
    "result": "OK",
    "drivers": [
        {
            "lat": 37.769996,
            "lng": -122.447329,
            "eta": "2015-04-28T19:54:44+00:00",
            "product": {
                "id": "CurbSanFrancisco",
                "name": "Curb San Francisco"
            }
        },
        {
            "lat": 37.769985,
            "lng": -122.44713,
            "eta": "2015-04-28T19:55:02+00:00",
            "product": {
                "id": "CurbSanFrancisco",
                "name": "Curb San Francisco"
            }
        },
        {
            "lat": 37.77086666666667,
            "lng": -122.44016666666666,
            "eta": "2015-04-28T19:54:25+00:00",
            "product": {
                "id": "CurbSanFrancisco",
                "name": "Curb San Francisco"
            }
        }
    ],
    "count": 3
}
disconnecting...
disconnected!

4) Start a trip

This script will take a template file and update it and then write out 
the finalized file and also send the finalized file to TripThru to start a trip

The adjustments that are made to the template before sending to TripThru:
a) update the pickup_time with a time that is 5 minutes into the future from "NOW"
b) create a unique tripid and insert it into the "id" field
c) write the file out to templates/tt_trip_request_now.js so that it can be reviewed if necessary

% node makeTrip_socketio.js templates/tt_trip_request_LA.js
output: 
Sending a dispatch-trip request:
{
    "customer": {
        "name": "Benjamin",
        "local_id": "en_US",
        "phone_number": "233-553-2343"
    },
    "pickup_location": {
        "lat": 34.0494,
        "lng": -118.242,
        "description": "will be waiting at main entrance."
    },
    "pickup_time": "2015-04-28T21:50:51+00:00",
    "dropoff_location": {
        "lat": 34.0495,
        "lng": -118.243
    },
    "passengers": 1,
    "luggage": 0,
    "payment_method_code": "cash",
    "id": "1327@fabless@tripthru.com"
}
created: templates/tt_trip_request_now.js
connected!
trip has been requested, disconnecting...
response:
{
    "result_code": 200,
    "result": "OK"
}
disconnecting...
disconnected!


5) Get trip status

Now that a trip is underway, use getTripStatus.js to monitor it.  This script is a little more complex than the other scripts.

This script will do the following:
a) indicate interest in the current trip's status
b) indicate interest in a request-payment
c) output the status of the trip whenever an update is provided (notice the "status" changes as the trip progresses)
d) when a payment request is made, the script will send a accept-payment message to indicate payment (hey, we even tip the driver 1 dollar)
e) once the accept-payment is complete, the script will exit

% node getTripStatus_socketio.js 
output:
connected!
Monitoring trip status for tripid: 
{
     "id": "1327@fabless@tripthru.com"
}
response: 
{
    "result_code": 200,
    "result": "OK",
    "product": {
        "id": "CurbLosAngeles",
        "name": "Curb Los Angeles",
        "image_url": "http://www.tripthru.com/assets/networks/curb@tripthru.com.png"
    },
    "customer": {
        "name": "Benjamin"
    },
    "status": "accepted",
    "eta": "2015-04-28T21:50:51+00:00",
    "driver": {
        "name": "Mary 126",
        "location": {
            "lat": 34.049442,
            "lng": -118.241733
        }
    },
    "originatingNetwork": {
        "id": "fabless@tripthru.com",
        "name": "fabless@tripthru.com"
    },
    "servicingNetwork": {
        "id": "curb@tripthru.com",
        "name": "Curb"
    }
}
got update-trip-status!
{
     "id": "1327@fabless@tripthru.com",
     "client_id": "curb@tripthru.com",
     "status": "en_route",
     "product": {
          "id": "CurbLosAngeles",
          "name": "Curb Los Angeles",
          "image_url": "http://www.tripthru.com/assets/networks/curb@tripthru.com.png"
     },
     "eta": "2015-04-28T21:47:58+00:00",
     "driver": {
          "name": "Mary 126",
          "location": {
               "lat": 34.049442,
               "lng": -118.241733
          }
     }
}
got update-trip-status!
{
     "id": "1327@fabless@tripthru.com",
     "client_id": "curb@tripthru.com",
     "status": "picked_up",
     "product": {
          "id": "CurbLosAngeles",
          "name": "Curb Los Angeles",
          "image_url": "http://www.tripthru.com/assets/networks/curb@tripthru.com.png"
     },
     "eta": "2015-04-28T21:48:21+00:00",
     "driver": {
          "name": "Mary 126",
          "location": {
               "lat": 34.0494,
               "lng": -118.242
          }
     }
}
got update-trip-status!
{
     "id": "1327@fabless@tripthru.com",
     "client_id": "curb@tripthru.com",
     "status": "completed",
     "product": {
          "id": "CurbLosAngeles",
          "name": "Curb Los Angeles",
          "image_url": "http://www.tripthru.com/assets/networks/curb@tripthru.com.png"
     },
     "eta": "2015-04-28T21:48:21+00:00",
     "driver": {
          "name": "Mary 126",
          "location": {
               "lat": 34.0495,
               "lng": -118.243
          }
     }
}
got request-payment:
{
     "id": "1327@fabless@tripthru.com",
     "client_id": "tripthru",
     "fare": 3.150993199656,
     "currency_code": "USD"
}
sending payment notfication via accept-payment:
{
    "id": "1327@fabless@tripthru.com",
    "tip": {
        "amount": 1,
        "currency_code": "USD"
    },
    "confirmation": true
}
response:
{
    "result_code": 200,
    "result": "OK"
}
trip complete, exiting
disconnecting...
disconnected!

