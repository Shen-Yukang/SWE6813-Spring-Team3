const express = require('express');
const friendController = require('../controllers/friendController');

const router = express.Router();

router.post('/', friendController.addFriend);
router.get('/:userId', friendController.listFriends);

module.exports = router;
