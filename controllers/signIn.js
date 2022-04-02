const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedRequestError = require('../errors/unauthorized-request-error');

function signIn(req, res, next) {
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

      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      if (NODE_ENV === 'production') {
        res.cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          domain: '.ivan-diploma.nomoredomains.work',
        });
      } else {
        res.cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
        });
      }
      res.status(200).send({ message: 'success' });
      return Promise.resolve();
    })
    .catch((err) => {
      next(new UnauthorizedRequestError(err.message));
    });
}

module.exports = { signIn };
