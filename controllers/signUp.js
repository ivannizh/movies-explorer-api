const bcrypt = require('bcryptjs');
const BadRequestError = require('../errors/bad-request-error');
const User = require('../models/user');
const ConflictRequestError = require('../errors/conflict-request-error');

function signUp(req, res, next) {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, email, password: hash,
    })
      .then(({ _id }) => {
        User.findById(_id)
          .then((user) => {
            if (!user) {
              return Promise.reject(new Error('Internal error'));
            }
            res.send(user);
            return Promise.resolve();
          })
          .catch((err) => Promise.reject(err));
        return Promise.resolve();
      })
      .catch((err) => {
        if (err.name === 'MongoServerError' && err.code === 11000) {
          next(new ConflictRequestError('Email уже существует'));
          return;
        }
        if (err.name === 'ValidationError') {
          next(new BadRequestError(`Некорректные данные ${err}`));
        } else {
          next(err);
        }
      });
  });
}

module.exports = { signUp };
