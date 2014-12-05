exports.deviceTypes = {
  method: 'GET',
  path: '/api/v1/device_types',
  handler: function (request, reply) {
    swaggerApi.configSwagger(request.session.get('accessToken'), function(api){
      api.deviceTypes(request.session.get('currentUser').id, reply, reply);
    });
  }
};
