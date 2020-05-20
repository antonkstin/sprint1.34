const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const WestCoastCustomError = require('./error');

function auth(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    throw new WestCoastCustomError("Необходима авторизация", 401);
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'alohomora');
  } catch (err) {
    throw new WestCoastCustomError("Необходима авторизация", 401);
  }

  req.user = payload;

  next();
}

module.exports = {
  auth
};
