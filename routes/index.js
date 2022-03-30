const routes = require('express').Router();

routes.use(require('./users'));
routes.use(require('./movies'));

module.exports = { routes };
