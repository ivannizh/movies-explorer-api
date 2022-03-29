const routerUser = require('./users');
const routerMovie = require('./movies');
// eslint-disable-next-line import/order
const router = require('express').Router();

router.use('/users', routerUser);
router.use('/movies', routerMovie);

module.exports = { router };
