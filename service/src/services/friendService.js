const friendRepository = require('../repositories/friendRepository');
const userRepository = require('../repositories/userRepository');

async function addFriend({ userId, friendUserId }) {
  if (!(await userRepository.findById(userId)) || !(await userRepository.findById(friendUserId))) {
    const err = new Error('user not found');
    err.statusCode = 404;
    throw err;
  }

  return friendRepository.add({ userId, friendUserId });
}

async function listFriends(userId) {
  return friendRepository.listByUserId(userId);
}

module.exports = {
  addFriend,
  listFriends,
};
