
USING AWS for testing simulator:

launch basic (free) Ubuntu server 
(use your keypair when launching the server, some examples below use the keypair: fabless.pem)

Some examples below use the server name: ec2-52-11-176-41.us-west-2.compute.amazonaws.com
(your server name will be similar to this but differently named)


Steps to launch simulator:

# copy simulator file to your newly launched server
scp -i <path_to_your_keypair> tripthruNetworkSimulator.gz ubuntu@<your_server_name>:/home/ubuntu

Example:
scp -i ~/.ssh/tripthru.pem tripthruNetworkSimulator.gz ubuntu@ec2-52-11-176-41.us-west-2.compute.amazonaws.com:/home/ubuntu



# log into the the server
ssh -i <path_to_your_keypair> ubuntu@<your_server_name>

Example:
ssh -i ~/.ssh/fabless.pem ubuntu@ec2-52-11-176-41.us-west-2.compute.amazonaws.com



# install and update server with system software 
sudo apt-get install nodejs

sudo apt-get update

sudo apt-get upgrade 
(curses-based menu may pop up: install the package maintainer's version)

sudo apt-get install unzip

sudo apt-get install npm

sudo npm install -g node-gyp

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10

echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list

sudo apt-get update

sudo apt-get install -y --force-yes mongodb-org

sudo apt-get install nodejs-legacy

sudo npm install -g grunt

tar xvf tripthruNetworkSimulator.gz

cd tripthruNetworkSimulator

sudo npm install


# start the simulator

node start network.js

Configuration instructions

config.js: Specify the tripthru api url, your own url if chosen endpoint is restful (expressPort and expressUrl) and the MongoDb connection settings.

network_config/network.js: here you specify each network's simulation settings


