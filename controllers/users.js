const path = require('path');

const User = require(path.join(__dirname, '../models/user'));

function getUser(req, res) {
  User.findById(req.params.id)
    .then((user) => res.send(user))
    .catch((err) => res.status(404).send('Нет пользователя с таким id'));
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send('Не удалось создать пользователя'));
}

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send('Произошла неведомая ошибка'));
}

module.exports = {
  getUser,
  createUser,
  getUsers
};
