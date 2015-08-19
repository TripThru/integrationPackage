var logger = require('./src/logger');
var server = require('./server');
var fs = require('fs');
var SocketGatewayClient = require('./src/socket_gateway_client');
var RestfulGatewayClient = require('./src/restful_gateway_client');
var NetworkFactory = require('./src/network_factory');
var configDirectory = './network_config/';
var globalConfig = require('./config');
var https = require('https');

if(!globalConfig.tripthru.cert) {
  throw new Error('No certificate path configured.');
}
if(!globalConfig.tripthru.key) {
  throw new Error('No key path configured.');
}
if(!globalConfig.tripthru.passphrase) {
  throw new Error('No ssl passphrase configured.');
}
https.globalAgent.options.rejectUnauthorized = false;
https.globalAgent.options.cert = fs.readFileSync(globalConfig.tripthru.cert);
https.globalAgent.options.key = fs.readFileSync(globalConfig.tripthru.key);
https.globalAgent.options.passphrase = globalConfig.tripthru.passphrase;
  

function start(network, interval) {
  network
    .update()
    .then(function(){
      setTimeout(function(){
        start(network, interval);
      }, interval);
    })
    .error(function(err){
      logger.log('sim', 'Network ' + network.id + ' crashed: ' + err);
    });
}

var started = {};

function runOneNetwork(name) {
  var config = require(configDirectory + name);
  globalConfig.tripthru.token = config.tripthru.token;
  config.tripthru = globalConfig.tripthru;
  logger.log('init', 'Loading configuration ' + name);
  var simulationInterval = config.simulationInterval * 1000;
  logger.log('init', 'Creating network ' + name + 'from configuration...');
  var client = createGatewayClient(config);
  var network = NetworkFactory.createNetwork(client, config);

  if(config.endpointType === 'socket') {
    logger.log('init', 'Opening socket client ' + name + '...');
    client.open(config.tripthru.url, config.tripthru.token, config.tripthru.cert, 
      config.tripthru.key, config.tripthru.passphrase, 
      function() {
        logger.log('init', 'Socket open, starting simulation ' + name + '...');
        client.setListener(network);
        setNetworkInfoAndStartSimulation(network, simulationInterval);
       }
    );
  } else {
    logger.log('init', 'Starting simulation ' + name + '...');
    setNetworkInfoAndStartSimulation(network, simulationInterval);
  }
  return network;
}

function setNetworkInfoAndStartSimulation(network, simulationInterval) {
  if(!started.hasOwnProperty(network.name)) {
    started[network.name] = true;
    network
      .setNetworkInfoAtTripThru()
      .then(function(){
        setTimeout(function(){
          start(network, simulationInterval);
        }, 5000);
      });
  } else {
    throw new Error(network.name + ' is already running');
  }
}

function createGatewayClient(config) {
  if(!config.tripthru.token) {
    throw new Error('No access token configured.');
  }
  var client; 
  if(config.endpointType === 'socket') {
    client = new SocketGatewayClient('client ' + config.name, 'client' + config.name,
      config.clientId);
  } else if(config.endpointType === 'restful') {
    client = new RestfulGatewayClient('client ' + config.name, 'client' + config.name,
        config.tripthru.url, config.tripthru.token, config.tripthru.cert, config.tripthru.key,
        config.tripthru.passphrase);
  } else {
    throw new Error('Unknown endpoint type');
  }
  return client;
}

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function startServer(networksById){
  server.init(networksById);
}

function runAllNetworks() {
  var files = fs.readdirSync(configDirectory);
  var networksById = [];
  for(var i = 0; i < files.length; i++) {
    if(endsWith(files[i].toString(), '.js')) {
      var network = runOneNetwork(files[i]);
      networksById[network.id] = network;
    }
  }
  return networksById;
}

var configName = process.argv[2];
if(!configName) {
  throw new Error('Please specify a configuration name or \'all\' to run all');
}
var networksById = {};
if(configName === 'all') {
  networksById = runAllNetworks();
} else {
  var network = runOneNetwork(configName);
  networksById[network.id] = network;
}
logger.log('init', 'Starting express...');
startServer(networksById);