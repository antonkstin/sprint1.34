const { JWT_SECRET = 'alohomora' } = process.env;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require(path.join(__dirname, '../models/user'));
const WestCoastCustomError = require('../middlewares/error');

function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true
      })
        .end();
    })
    .catch(next);
}

function getUser(req, res, next) {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new WestCoastCustomError("Поьзователь не найден", 404);
      }
      res.send(user);
    })
    .catch(next);
}

function createUser(req, res, next) {
  const {
    email, password, name, about, avatar
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar
    }))
    .then((user) => {
      const obj = user.toObject();
      delete obj.password;
      res.send(obj);
    })
    .catch(next);
}

function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
}

module.exports = {
  login,
  getUser,
  createUser,
  getUsers
};
