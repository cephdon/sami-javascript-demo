var _ = require('underscore');

exports.devices = {
  method: 'GET',
  path: '/api/v1/devices',
  handler: function (request, reply) {
    swaggerApi.configSwagger(request.session.get('accessToken'), function(api){
      api.devices(request.session.get('currentUser').id, reply, reply);
    });
  }
};

exports.destroyDevice = {
  method: 'DELETE',
  path: '/api/v1/devices/{deviceId}',
  handler: function (request, reply) {
    swaggerApi.configSwagger(request.session.get('accessToken'), function(api){
      api.destroyDevice(request.params.deviceId, reply, reply);
    });
  }
};

exports.createDevice = {
  method: 'POST',
  path: '/api/v1/devices',
  handler: function (request, reply) {
    swaggerApi.configSwagger(request.session.get('accessToken'), function(api){
      var params = _.extend(request.payload, {
        uid: request.session.get('currentUser').id,
      });
      api.createDevice(params, reply, reply);
    });
  }
};
