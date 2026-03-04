const express = require('express');
const matchmakingController = require('../controllers/matchmakingController');

const router = express.Router();

router.get('/:userId', matchmakingController.getMatches);

module.exports = router;
