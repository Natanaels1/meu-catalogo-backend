const Fastify = require('fastify');
const routes = require('./routes');

const app = Fastify({ 
    logger: false 
});

app.register(routes);
app.register(require('@fastify/multipart'))

module.exports = app;