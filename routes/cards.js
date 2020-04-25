const router = require('express').Router();
const path = require('path');

const {
  deleteCard,
  createCard,
  getCards
} = require(path.join(__dirname, '../controllers/cards'));

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:id', deleteCard);

module.exports = router;
