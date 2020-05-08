const router = require('express').Router();
const path = require('path');

const {
  getUser,
  getUsers
} = require(path.join(__dirname, '../controllers/users'));

router.get('/', getUsers);
router.get('/:id', getUser);

module.exports = router;
