const routerUser = require('express').Router();
const { updateUser, getMe } = require('../controllers/users');
const {
  updateUserData,
} = require('../middlewares/validatons');

routerUser.get('/me', getMe);
routerUser.patch('/me', updateUserData, updateUser);

module.exports = routerUser;
