var swaggerApi = require('./lib/swaggerApi');
var client = require("swagger-client");
var Path = require('path');
var fs = require('fs');

exports.configViews = function(server){
  server.views({
    engines: {
      jade: require('jade')
    },
    path: Path.join(__dirname, 'templates'),
  });
};

exports.configAssets = function(server){
  server.route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: 'assets'
      }
    }
  });
};

exports.configSessions = function(server){
  var options = {
    cookieOptions: {
      password: 'asdfasdf',
      isSecure: false
    }
  };

  server.pack.register({
    plugin: require('yar'),
    options: options
  }, function (err) { });
};

exports.configSwaggerSpec = function(server){
  server.route({
    method: 'GET',
    path: '/swagger',
    handler: function (request, reply) {
      var file = 'swagger/api-docs.json';
      reply(JSON.parse(fs.readFileSync(file, 'UTF-8')));
    }
  });

  server.route({
    method: 'GET',
    path: '/swagger/{param*}',
    handler: function (request, reply) {
      var file = 'swagger/' + request.params.param;
      reply(JSON.parse(fs.readFileSync(file, 'UTF-8')));
    }
  });
};

exports.configSwaggerApi = {
  configSwagger: function(accessToken, callback){
    client.authorizations.add(
      "accessToken",
      new client.ApiKeyAuthorization(
        "Authorization",
        "Bearer " + accessToken,
        "header"
      )
    );

    var swagger = new client.SwaggerApi({
      url: 'http://localhost:3000/swagger',
      success: function() {
        if(swagger.ready === true) {
          api = new swaggerApi.Api(swagger);
          callback(api);
        }
      }
    });
  }
};
