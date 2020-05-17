const router = require('express').Router();
const path = require('path');
const { celebrate, Joi } = require('celebrate');

const { getUser, getUsers } = require(path.join(__dirname, '../controllers/users'));

router.get('/', getUsers);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24)
  })
}), getUser);

module.exports = router;
