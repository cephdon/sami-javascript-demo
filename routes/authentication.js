exports.registerToken = {
  method: 'POST',
  path: '/api/v1/auth/token',
  handler: function (request, reply) {
    request.session.set('accessToken', request.payload.accessToken);
    swaggerApi.configSwagger(request.session.get('accessToken'), function(api){
      api.self(function(data){
        request.session.set('currentUser', data);
        reply(request.session.get('currentUser'));
      });
    });
  }
};

exports.unregisterToken = {
  method: 'DELETE',
  path: '/api/v1/auth/token',
  handler: function (request, reply) {
    request.session.clear('accessToken');
    reply({ success: 'ok'});
  }
};

exports.authCallback = {
  method: 'GET',
  path: '/auth/samihub/callback',
  handler: function (request, reply) {
    reply(request.query);
  }
};
