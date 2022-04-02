const jwt = require('jsonwebtoken');
const UnauthorizedRequestError = require('../errors/unauthorized-request-error');

function auth(req, res, next) {
  const { jwt: authorization } = req.cookies;

  if (!authorization) {
    next(new UnauthorizedRequestError('Необходима авторизация'));
    return;
  }

  const { NODE_ENV, JWT_SECRET } = process.env;

  let payload;
  try {
    payload = jwt.verify(authorization, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      next(new UnauthorizedRequestError('Необходима авторизация'));
    } else {
      next(err);
    }
    return;
  }

  req.user = payload;
  next();
}
module.exports = { auth };
