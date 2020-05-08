const path = require('path');

const Card = require(path.join(__dirname, '../models/card'));

function deleteCard(req, res) {
  Card.findById(req.params.id)
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        return Promise.reject(new Error(`Вы не можете удалять чужие карточки`));
      }
      return card._id;
    })
    .then((cardId) => {
      Card.findByIdAndRemove(cardId)
        .then((card) => {
          res.send(`Вы только что удалили карточку ${card}`);
        })
        .catch((err) => res.status(500).send('Не удалось удалить карточку'));
    })
    .catch((err) => {
      res.status(403).send({ "message": err.message });
    });
}

function createCard(req, res) {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send('Не удалось создать карточку'));
}

function getCards(req, res) {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send('Произошла неведомая ошибка'));
}

module.exports = {
  deleteCard,
  createCard,
  getCards
};
