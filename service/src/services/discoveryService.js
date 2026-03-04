const userRepository = require('../repositories/userRepository');

async function searchPlayers({ query = '' }) {
  const users = await userRepository.listAll();
  return users
    .filter((user) => user.username.toLowerCase().includes(query.toLowerCase()))
    .map((user) => ({
      id: String(user._id),
      username: user.username,
    }));
}

module.exports = {
  searchPlayers,
};
