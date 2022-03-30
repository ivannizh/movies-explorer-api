const routerUser = require('express').Router();
const { updateUser, getMe } = require('../controllers/users');
const {
  updateUserData,
} = require('../middlewares/validatons');

routerUser.get('/api/users/me/', getMe);
routerUser.patch('/api/users/me/', updateUserData, updateUser);

module.exports = routerUser;
