const Fastify = require('fastify');
const routes = require('./routes');

const app = Fastify({ logger: false });
app.register(routes);

module.exports = app;