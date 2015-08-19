var io = require('socket.io-client');
var querystring = require('querystring');
var Gateway = require('./gateway').Gateway;
var IGateway = require('./gateway').IGateway;
var Interface = require('./interface').Interface;
var logger = require('./logger');
var codes = require('./codes');
var resultCodes = codes.resultCodes;
var https = require('https');

function SocketGatewayClient(id, name, clientId) {
  Gateway.call(this, id, name);
  this.socket = null;
  this.listener = null;
  this.clientId = clientId;
}

SocketGatewayClient.prototype.setListener = function(listener) {
  Interface.ensureImplements(listener, IGateway);
  this.listener = listener;
  
  //Trips
  this.socket.on('dispatch-trip', function(req, cb){
    this.listener.dispatchTrip(req).then(cb);
  }.bind(this));
  this.socket.on('get-trip', function(req, cb){
    this.listener.getTrip(req).then(cb);
  }.bind(this));
  this.socket.on('get-trip-status', function(req, cb){
    this.listener.getTripStatus(req).then(cb);
  }.bind(this));
  this.socket.on('update-trip-status', function(req, cb){
    this.listener.updateTripStatus(req).then(cb);
  }.bind(this));
  this.socket.on('request-payment', function(req, cb){
    this.listener.requestPayment(req).then(cb);
  }.bind(this));
  this.socket.on('accept-payment', function(req, cb){
    this.listener.acceptPayment(req).then(cb);
  }.bind(this));
  
  //Quotes
  this.socket.on('get-quote', function(req, cb){
    this.listener.getQuote(req).then(cb);
  }.bind(this));
  
  //Users
  this.socket.on('get-network-info', function(req ,cb){
    this.listener.getNetworkInfo(req).then(cb);
  }.bind(this));
  this.socket.on('get-drivers-nearby', function(req, cb){
    this.listener.getDriversNearby(req).then(cb);
  }.bind(this));
};

SocketGatewayClient.prototype.open = function(url, token, cert, key, passphrase, cb) {
  this.socket = io.connect(url, {
    forceNew: true,
    query: querystring.stringify({token: token, replace: true}),
    transports: ['websocket'],
    agent: https.globalAgent,
    secure: true
  });
  
  this.socket.on('connect', function (){
    logger.log(this.clientId, 'Connected to ' + url);
    if(this.listener) {
      this.setListener(this.listener);
    }
    cb();
  }.bind(this));
  
  this.socket.on('error', function (data){
    logger.log(this.clientId, 'Error on ' + url, data);
  }.bind(this));
  
  this.socket.on('disconnect', function (){
    logger.log(this.clientId, 'Disconnected from ' + url);
    this.open(url, token, function(){
      logger.log(this.clientId, 'Reconnected to ' + url);
    }.bind(this));
  }.bind(this));
  
  this.socket.on('hi', function(msg, cb){
    logger.log(msg);
    cb('hi');
  });
};

SocketGatewayClient.prototype.emit = function(action, request) {
  var self = this;
  return new Promise(function(resolve, reject){
    self.socket.emit(action, request, function(res){
      if(!res) {
        res = {
          result_code: resultCodes.unknownError
        };
      }
      logger.log(self.listener.id, 'Emitted ' + action + ' ' + request.id + ', res: ' + res.result_code);
      resolve(res);
    });
  });
};

SocketGatewayClient.prototype.getNetworkInfo = function(request) {
  return this.emit('get-network-info', request);
};

SocketGatewayClient.prototype.setNetworkInfo = function(request) { 
  return this.emit('set-network-info', request);
};

SocketGatewayClient.prototype.dispatchTrip = function(request) {
  return this.emit('dispatch-trip', request);
};

SocketGatewayClient.prototype.getTrip = function(request) {
  return this.emit('get-trip', request);
};

SocketGatewayClient.prototype.getTripStatus = function(request) {
  return this.emit('get-trip-status', request);
};

SocketGatewayClient.prototype.updateTripStatus = function(request) {
  return this.emit('update-trip-status', request);
};

SocketGatewayClient.prototype.requestPayment = function(request) {
  return this.emit('request-payment', request);
};

SocketGatewayClient.prototype.acceptPayment = function(request) {
  return this.emit('accept-payment', request);
};

SocketGatewayClient.prototype.getQuote = function(request) {
  return this.emit('get-quote', request);
};

SocketGatewayClient.prototype.getDriversNearby = function(request) {
  return this.emit('get-drivers-nearby', request);
};

module.exports = SocketGatewayClient;