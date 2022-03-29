const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictRequestError = require('../errors/conflict-request-error');
const UnauthorizedRequestError = require('../errors/unauthorized-request-error');

function createUser(req, res, next) {
  const {
    name, email, password,
  } = req.body;

  if (!validator.isEmail(email)) {
    next(new BadRequestError('Wrong email validation'));
    return;
  }

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

function login(req, res, next) {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return { matched: bcrypt.compare(password, user.password), user };
    })
    .then(({ matched, user }) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        // secure: true,
        // sameSite: 'none',
        // domain: '.ivannizh.nomoredomains.work',
      });
      res.status(200).send({ message: 'success' });
      return Promise.resolve();
    })
    .catch((err) => {
      next(new UnauthorizedRequestError(err.message));
    });
}

function getMe(req, res, next) {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ user });
      } else {
        next(new NotFoundError('User not found'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id'));
      } else {
        next(err);
      }
    });
}

function updateUser(req, res, next) {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, email: req.body.email },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  createUser, updateUser, login, getMe,
};
