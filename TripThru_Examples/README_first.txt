
# file: README_first.txt


To use these examples you will neeed:

    - AWS account, so you can launch a server (free-tier)
    - ssl key file and ssl certificate file (from TripThru)
    - Password for the ssl certificate file (from TripThru)
    - Company Token String (from TripThru)


This set of instructions will help you set up a free-tier server on AWS 
which you can use to run the TripThru examples.

There are two sets of examples in this kit for two different types of web communication with TripThru:

1) socket.io examples
2) curl examples

Both example sets show you how to configure your TripThru configuration, 
then make a trip, monitor it's progress and then finally confirm payment for the trip.


You must have an AWS account to use these examples, they were built with using the Ubuntu free-tier 
server.  It is expected that you know how to use the AWS EC2 Dashboard to startup and configure 
a server on AWS.  It is also expected that you know how to log into your AWS server once it has been launched.

Helpful links for setting up and logging into your AWS server:

http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Configure_Instance.html
http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html

The steps to take to fully configure and prepare your server for use with these examples:

A) Launch an AWS free-tier ubuntu server

No extra storage is necessary 

When setting up the server make sure that these ports are open

22
80
443

B) Copy the TripThru_Examples.gz and ssl key & certificate files to the server

# Copy the TripThru_Examples.gz file to the server

% scp -i ~/.ssh/<your pem> TripThru_Examples.gz ubuntu@<your AWS Public DNS>:~/

Example:  (your pem and server's DNS address will be different)

% scp -i ~/.ssh/fabless.pem TripThru_Examples.gz ubuntu@ec2-54-200-100-15.us-west-2.compute.amazonaws.com:~/



# Copy your ssl key file to the server

Example:  (your key file will be a different name)
% scp -i ~/.ssh/fabless.pem fabless_client.key ubuntu@ec2-54-200-100-15.us-west-2.compute.amazonaws.com:~/

# Copy your ssl certificate file to the server

Example:  (your certificate file will be a different name)
% scp -i ~/.ssh/fabless.pem fabless_client.crt ubuntu@ec2-54-200-100-15.us-west-2.compute.amazonaws.com:~/


C) Update the server's system software

Log into your AWS Server

ssh -i ~/.ssh/<your pem> ubuntu@<your AWS Public DNS>

Example:  (your pem and server's DNS address will be different)

ssh -i ~/.ssh/fabless.pem ubuntu@ec2-54-200-100-15.us-west-2.compute.amazonaws.com

Get and install nodejs with the steps below

NOTE: ubuntu has an existing program called "node", 
we will replace it with the newly installed nodejs

% sudo apt-get update
% sudo apt-get install npm -y
% sudo apt-get install nodejs
% sudo apt-get install node -y
% sudo apt-get update

% sudo mv /usr/sbin/node /usr/sbin/original_node
% sudo ln -s /usr/bin/nodejs /usr/sbin/node



D) Configure & turn on port forwarding

# If this command produces a 0, port forwarding is turned off
% cat /proc/sys/net/ipv4/ip_forward

# Edit system config file to uncomment one line:
% sudo vim /etc/sysctl.conf

# Make this line active (should be on line 28)
net.ipv4.ip_forward=1

# Activate the change to the sysctl.conf file
% sudo sysctl -p /etc/sysctl.conf

# This command produces should now produce a 1
% cat /proc/sys/net/ipv4/ip_forward

# Now that port forwarding is turned on, redirect 80 to 8080
% sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
% sudo iptables -A INPUT -p tcp -m tcp --sport 80 -j ACCEPT
% sudo iptables -A OUTPUT -p tcp -m tcp --dport 80 -j ACCEPT

More information on these steps can be found here:
http://www.lauradhamilton.com/how-to-set-up-a-nodejs-web-server-on-amazon-ec2


E) Install TripThru_Examples and update the configuration file for TripThru callback_url

# Expand the TripThru_Examples.gz 
% tar xvfz TripThru_Examples.gz

# copy the ssl key and certificate files into the TripThru_Examples directory (your key/cert files will have a different name)
% cp fabless_client.key TripThru_Examples
% cp fabless_client.crt TripThru_Examples

# Step into the TripThru_Examples installation directory
% cd TripThru_Examples

# Edit configure file templates/tt_network_post_for_curl.js:
% vi templates/tt_network_post_for_curl.js

# Change this line:

"callback_url": "http://ec2-54-200-100-15.us-west-2.compute.amazonaws.com",

to contain your server's public DNS address

Example: (your server will have a different address) 

"callback_url": "http://ec2-52-24-25-107.us-west-2.compute.amazonaws.com",


# change this line 

"image_url": "http://www.tripthru.com/assets/networks/fabless@tripthru.com.png",

to contain an image for your company name (TripThru may provide this path to you) 

Example:

"image_url": "http://www.tripthru.com/assets/networks/greentaxi@tripthru.com.png",


# Edit configure file templates/tt_network_post_for_socketio.js
% vi templates/tt_network_post_for_socketio.js

# change this line:

"id": "fabless@tripthru.com",

to your company Id:

Example:

"id": "greentaxi@tripthru.com",

# change this line 

"image_url": "http://www.tripthru.com/assets/networks/fabless@tripthru.com.png",

to contain an image for your company name (TripThru may provide this path to you) 

Example:

"image_url": "http://www.tripthru.com/assets/networks/greentaxi@tripthru.com.png",

 


F) Install node modules for the examples

% npm install



G) Edit the helpers.js file so that it contains your company configuration information

% vi helpers.js

Change these lines to reflect your company name, ssl key & certificate files, password and company token:
var companyIdTemplate = "fabless@tripthru.com";
var companyKeyFile = "fabless_client.key";
var companyCertFileAndPass = "fabless_client.crt:password";
var companyTokenValue = "PvyCtquoXElKwQyELxcoDzBhHtnXOzgSekmFZXFc";

Example: (changing to greentaxi)
[ you will use the values and files that TripThru provides to you ]

var companyIdTemplate = "greentaxi@tripthru.com";
var companyKeyFile = "greentaxi_client.key";
var companyCertFileAndPass = "greentaxi_client.crt:greentaxipassword";
var companyTokenValue = "Exjdflj5jsdlslsdhbggjekselkjeheshsflwefehefelii";



H) Try the examples, helpful steps are provided in a README file that is specific to each web connection type

README_curl.txt

README_socketio.txt



NOTES: 

Special thanks to this site for helping to create the mini-server
https://github.com/heroku/node-js-sample.git
