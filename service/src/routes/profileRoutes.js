const express = require('express');
const profileController = require('../controllers/profileController');

const router = express.Router();

router.put('/:userId', profileController.upsertProfile);
router.get('/:userId', profileController.getProfile);

module.exports = router;
