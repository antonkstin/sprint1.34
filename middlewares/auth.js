const jwt = require('jsonwebtoken');
const WestCoastCustomError = require('./error');

const alohomora = require('../alohomora');

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new WestCoastCustomError("Необходима авторизация", 401);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, alohomora);
  } catch (err) {
    throw new WestCoastCustomError("Необходима авторизация", 401);
  }

  req.user = payload;

  next();
}

module.exports = {
  auth
};
