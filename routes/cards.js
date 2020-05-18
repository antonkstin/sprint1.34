const router = require('express').Router();
const path = require('path');
const { celebrate, Joi } = require('celebrate');

const { deleteCard, createCard, getCards } = require(path.join(__dirname, '../controllers/cards'));

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2)
  })
}), createCard);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24)
  })
}), deleteCard);

module.exports = router;
