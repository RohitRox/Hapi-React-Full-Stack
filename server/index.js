'use strict';

const Hapi = require('hapi');
const Path = require('path');

const NodeEnv = process.env['NODE_ENV'] || 'development';

const Config = require('../config');

const server = new Hapi.Server();
server.connection(Config.server[NodeEnv]);

const logOptions = {
  reporters: {
    console: [
      {
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ response: '*', log: '*' }]
      },
      { module: 'good-console' },
      'stdout'
    ]
  }
};

server.register([
  {
    register: require('inert')
  },
  {
    register: require('good'),
    options: logOptions
  }
], (err) => {
  if (err) {
    // something bad happened loading the plugin
    throw err;
  }
});

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply.file('public/index.html');
  }
});

server.route({
  method: 'GET',
  path: '/public/{param*}',
  handler: {
    directory: {
      path: 'public'
    }
  }
});

server.route({
  method: 'GET',
  path: '/api',
  handler: function (request, reply) {
    reply({ data: 'API coming soon ...' });
  }
});

server.start((err) => {
  if (err) {
    throw err;
  }
  server.log('info', 'Server running at: ' + server.info.uri);
});
