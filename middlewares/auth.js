const jwt = require('jsonwebtoken');

const alohomora = '1dbdc66c9d8935c22ef83c75c6d7ca64';

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: "Необходима авторизация" });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, alohomora);
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
}

module.exports = {
  auth
};
