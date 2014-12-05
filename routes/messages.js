var _ = require('underscore');

exports.messages = {
  method: 'GET',
  path: '/api/v1/messages',
  handler: function (request, reply) {
    swaggerApi.configSwagger(request.session.get('accessToken'), function(api){
      api.devices(request.session.get('currentUser').id, function(devices){
        api.messages(_.pluck(devices, 'id').join(','), reply, reply);
      });
    });
  }
};
