const router = require('express').Router();
const path = require('path');

const {
  getUser,
  createUser,
  getUsers
} = require(path.join(__dirname, '../controllers/users'));

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUser);

module.exports = router;
