const path = require('path');

const Card = require(path.join(__dirname, '../models/card'));
const WestCoastCustomError = require('../middlewares/error');

function deleteCard(req, res, next) {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new WestCoastCustomError("Карточка не найдена", 404);
      }
      if (req.user._id !== card.owner.toString()) {
        throw new WestCoastCustomError("Вы не можете удалять чужие карточки", 403);
      }
      return card;
    })
    .then((card) => {
      Card.remove(card)
        .then(() => {
          res.send(card);
        })
        .catch(next);
    })
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch(next);
}

function getCards(req, res, next) {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
}

module.exports = {
  deleteCard,
  createCard,
  getCards
};
