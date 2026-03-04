const userRepository = require('../repositories/userRepository');
const { hashPassword, verifyPassword } = require('../utils/hash');

async function register({ username, password }) {
  if (!username || !password) {
    const err = new Error('username and password are required');
    err.statusCode = 400;
    throw err;
  }

  if (await userRepository.findByUsername(username)) {
    const err = new Error('username already exists');
    err.statusCode = 409;
    throw err;
  }

  const user = await userRepository.create({
    username,
    passwordHash: hashPassword(password),
  });

  return user;
}

async function login({ username, password }) {
  const user = await userRepository.findByUsername(username);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    const err = new Error('invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  return {
    token: Buffer.from(`${user._id}:${user.username}`).toString('base64'),
    user: {
      id: String(user._id),
      username: user.username,
    },
  };
}

module.exports = {
  register,
  login,
};
