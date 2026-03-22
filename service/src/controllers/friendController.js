const friendService = require('../services/friendService');

async function addFriend(req, res, next) {
  try {
    const edge = await friendService.addFriend(req.body);
    res.status(201).json(edge);
  } catch (err) {
    next(err);
  }
}

async function listFriends(req, res, next) {
  try {
    const list = await friendService.listFriends(req.params.userId);
    res.status(200).json({ friends: list });
  } catch (err) {
    next(err);
  }
}

async function removeFriend(req, res, next) {
  try {
    const { userId, friendUserId } = req.body;
    await friendService.removeFriend({ userId, friendUserId });
    res.status(200).json({ message: 'Friend removed successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addFriend,
  listFriends,
  removeFriend,
};
