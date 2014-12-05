var Hapi = require('hapi');

exports.Api = function(swagger){
  var swagger = swagger;
  var errorHandler = function(callback){
    return function(response){
      var json = JSON.parse(response.data.toString());
      var error = Hapi.error.badRequest('Error');
      error.output.payload = json;
      callback(error);
    }
  };

  var self = function(callback){
    swagger.apis['users.json'].self({}, function(response){
      var json = JSON.parse(response.data.toString());
      callback(json.data);
    }, errorHandler(callback));
  };

  var devices = function(userId, callback, errorCallback){
    params = {
      includeProperties: true,
      userId: userId
    };
    swagger.apis['users.json'].getUserDevices(params, function(response){
      var json = JSON.parse(response.data.toString());
      callback(json.data.devices);
    }, errorHandler(callback));
  };

  var messages = function(deviceIds, callback){
    var params = {
      sdids: deviceIds,
      count: 100
    };
    swagger.apis['messages.json'].getNormalizedMessagesLast(params, function(response){
      var json = JSON.parse(response.data.toString());
      callback(json.data);
    }, errorHandler(callback));
  };

  var createDevice = function(params, callback){
    params = {
      body: JSON.stringify(params)
    };
    swagger.apis['devices.json'].addDevice(params, function(response){
      var json = JSON.parse(response.data.toString());
      callback(json.data);
    }, errorHandler(callback));
  };

  var destroyDevice = function(deviceId, callback){
    params = {
      deviceId: deviceId,
      body: '{}'
    };
    swagger.apis['devices.json'].deleteDevice(params, function(response){
      var json = JSON.parse(response.data.toString());
      callback(json.data);
    }, errorHandler(callback));
  };

  var deviceTypes = function(userId, callback){
    var params = {
      offset: 0,
      count: 100,
      includeShared: true,
      userId: userId
    };
    swagger.apis['users.json'].getUserDeviceTypes(params, function(response){
      var json = JSON.parse(response.data.toString());
      callback(json.data.deviceTypes);
    }, errorHandler(callback));
  };

  return {
    messages: messages,
    deviceTypes: deviceTypes,
    createDevice: createDevice,
    destroyDevice: destroyDevice,
    devices: devices,
    self: self
  };
};
