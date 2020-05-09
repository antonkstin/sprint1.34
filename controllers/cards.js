const path = require('path');

const Card = require(path.join(__dirname, '../models/card'));

function deleteCard(req, res) {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        return Promise.reject(new Error("Карточка не найдена или уже удалена"));
      }
      if (req.user._id !== card.owner.toString()) {
        return Promise.reject(new Error("Вы не можете удалять чужие карточки"));
      }
      return card._id;
    })
    .then((cardId) => {
      Card.findByIdAndRemove(cardId)
        .then((card) => {
          res.send({ "message": "Вы удалили карточку" });
        })
        .catch((err) => res.status(500).send({ "message": "Серверная ошибка: не удалось удалить карточку" }));
    })
    .catch((err) => {
      res.status(403).send({ "message": err.message });
    });
}

function createCard(req, res) {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ "message": "Серверная ошибка: не удалось создать карточку" }));
}

function getCards(req, res) {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ "message": "Серверная ошибка: что-то пошло не так" }));
}

module.exports = {
  deleteCard,
  createCard,
  getCards
};
