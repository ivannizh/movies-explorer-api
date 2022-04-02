const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictRequestError = require('../errors/conflict-request-error');

function getMe(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        next(new NotFoundError('User not found'));
      }
    })
    .catch(next);
}

function updateUser(req, res, next) {
  User.findById(req.user._id).then((u) => {
    if (u.name === req.body.name) {
      next(new BadRequestError('Имя не поменялось'));
      return;
    }

    User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, email: req.body.email },
      { new: true, runValidators: true },
    )
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Некорректные данные'));
        } else if (err.code === 11000) {
          next(new ConflictRequestError('Такой email уже существует'));
        } else {
          next(err);
        }
      });
  }).catch(next);
}

module.exports = { updateUser, getMe };
