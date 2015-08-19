var Promise = require('bluebird');
var Gateway = require('./gateway').Gateway;
var IGateway = require('./gateway').IGateway;
var Interface = require('./interface').Interface;
var request = require('request');
var logger = require('./logger');
var fs = require('fs');

function RestfulGateway(id, name, rootUrl, token, cert, key, passphrase) {
  this.id = id;
  this.name = name;
  this.rootUrl = rootUrl;
  this.token = token;
  this.agentOptions = {
    cert: fs.readFileSync(cert),
    key: fs.readFileSync(key),
    passphrase: passphrase,
    rejectUnauthorized: false,
    securityOptions: 'SSL_OP_NO_SSLv3'
  };
  Gateway.call(this, id, name);
}

RestfulGateway.prototype.get = function(path, id, req) {
  return new Promise(function(resolve, reject){
    if(id) {
      path += '/' + id;
    }
    var client_id = this.id;
    var url = this.rootUrl + path + '?token=' + this.token;
    request({
      url: url,
      method: 'GET',
      timeout: 60000,
      followRedirect: true,
      maxRedirects: 10,
      body: req,
      json: true,
      agentOptions: this.agentOptions
    }, function(error, response, body){
      if(error) {
        logger.log(client_id, 'GET ' + path + ', error: ' + error);
        reject(error);
      } else {
        logger.log(client_id, 'GET ' + path + ', res: ' + body.result_code);
        resolve(body);
      }
    });
  }.bind(this));
};

RestfulGateway.prototype.post = function(path, id, req) {
  return new Promise(function(resolve, reject){
    if(id) {
      path += '/' + id;
    }
    var client_id = this.id;
    var url = this.rootUrl + path + '?token=' + this.token;
    request({
      url: url,
      method: 'POST',
      timeout: 60000,
      followRedirect: true,
      maxRedirects: 10,
      body: req,
      json: true,
      agentOptions: this.agentOptions
    }, function(error, response, body){
      if(error) {
        logger.log(client_id, 'POST ' + path + ', error: ' + error);
        reject(error);
      } else {
        logger.log(client_id, 'POST ' + path + ', res: ' + body.result_code);
        resolve(body);
      }
    });
  }.bind(this));
};

RestfulGateway.prototype.put = function(path, id, req) {
  return new Promise(function(resolve, reject){
    if(id) {
      path += '/' + id;
    }
    var client_id = this.id;
    var url = this.rootUrl + path + '?token=' + this.token;
    request({
      url: url,
      method: 'PUT',
      timeout: 60000,
      followRedirect: true,
      maxRedirects: 10,
      body: req,
      json: true,
      agentOptions: this.agentOptions
    }, function(error, response, body){
      if(error) {
        logger.log(client_id, 'PUT ' + path + ', error: ' + error);
        reject(error);
      } else {
        logger.log(client_id, 'PUT ' + path + ', res: ' + body.result_code);
        resolve(body);
      }
    });
  }.bind(this));
};

RestfulGateway.prototype.dispatchTrip = function(request) {
  return this.post('trip', request.id, request);
};

RestfulGateway.prototype.getTripStatus = function(request) {
  return this.get('tripstatus', request.id, request);
};

RestfulGateway.prototype.updateTripStatus = function(request) {
  return this.put('tripstatus', request.id, request);
};

RestfulGateway.prototype.getQuote = function(request) {
  return this.get('quote', request.id, request);
};

RestfulGateway.prototype.getNetworkInfo = function(request) {
  return this.get('network', request.id, request);
};

RestfulGateway.prototype.setNetworkInfo = function(request) {
  return this.post('network', null, request);
};

RestfulGateway.prototype.requestPayment = function(request) {
  return this.post('payment', request.id, request);
};

RestfulGateway.prototype.acceptPayment = function(request) {
  return this.put('payment', request.id, request);
};

RestfulGateway.prototype.getDriversNearby = function(request) {
  return this.get('drivers', null, request);
};

RestfulGateway.prototype.getTrip = function(request) {
  return this.get('trip', request.id, request);
};

module.exports = RestfulGateway;
