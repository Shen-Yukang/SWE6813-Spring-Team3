const friendRepository = require('../repositories/friendRepository');
const userRepository = require('../repositories/userRepository');

async function addFriend({ userId, friendUserId }) {
  if (!(await userRepository.findById(userId))) {
    const err = new Error('user not found');
    err.statusCode = 404;
    throw err;
  }

  return friendRepository.add({ userId, friendUserId });
}

async function listFriends(userId) {
  return friendRepository.listByUserId(userId);
}

async function removeFriend({ userId, friendUserId }) {
  return friendRepository.remove({ userId, friendUserId });
}

module.exports = {
  addFriend,
  listFriends,
  removeFriend,
};