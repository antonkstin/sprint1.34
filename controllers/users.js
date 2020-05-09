const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require(path.join(__dirname, '../models/user'));
const alohomora = require('../alohomora');

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
    .catch((err) => res.status(404).send({ "message": "Нет пользователя с таким id" }));
}

function createUser(req, res) {
  const {
    email, password, name, about, avatar
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar
    }))
    .then((user) => User.findById(user._id))
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ "message": "Серверная ошибка: не удалось создать пользователя" }));
}

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ "message": "Серверная ошибка: что-то пошло не так" }));
}

module.exports = {
  login,
  getUser,
  createUser,
  getUsers
};
