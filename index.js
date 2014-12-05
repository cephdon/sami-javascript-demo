var _ = require('underscore');
var Hapi = require('hapi');
var server = new Hapi.Server(3000);

var config = require('./config');
config.configSessions(server);
config.configViews(server);
config.configAssets(server);

config.configSwaggerSpec(server);

// Global vars
swaggerApi = config.configSwaggerApi;

routes = {};
_.extend(routes, require('./routes/templates'));
_.extend(routes, require('./routes/authentication'));
_.extend(routes, require('./routes/devices'));
_.extend(routes, require('./routes/deviceTypes'));
_.extend(routes, require('./routes/messages'));

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply.view('application', {
      clientId: process.env.SAMI_CLIENT_ID,
      accessToken: request.session.get('accessToken'),
      _: _
    });
  }
});

for (var route in routes) {
  server.route(routes[route]);
}

server.start(function () {
  console.log('Server running at:', server.info.uri);
});
