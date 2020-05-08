const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require(path.join(__dirname, '../models/user'));
const alohomora = '1dbdc66c9d8935c22ef83c75c6d7ca64';

function login(req, res) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, alohomora, { expiresIn: '7d' });
      res.send(token);
    })
    .catch((err) => {
      res.status(401).send({ "message": err.message });
    });
}

function getUser(req, res) {
  User.findById(req.params.id)
    .then((user) => res.send(user))
    .catch((err) => res.status(404).send('Нет пользователя с таким id'));
}

function createUser(req, res) {
  const {
    email, password, name, about, avatar
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar
    }))
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send('Не удалось создать пользователя'));
}

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send('Произошла неведомая ошибка'));
}

module.exports = {
  login,
  getUser,
  createUser,
  getUsers
};
