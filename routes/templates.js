exports.templates = {
  method: 'GET',
  path: '/templates/{param*}',
  handler: function (request, reply) {
    reply.view(request.params.param);
  }
};
