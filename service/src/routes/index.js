const express = require('express');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const matchmakingRoutes = require('./matchmakingRoutes');
const friendRoutes = require('./friendRoutes');
const groupRoutes = require('./groupRoutes');
const discoveryRoutes = require('./discoveryRoutes');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/matchmaking', matchmakingRoutes);
router.use('/friends', friendRoutes);
router.use('/groups', groupRoutes);
router.use('/discovery', discoveryRoutes);

module.exports = router;
