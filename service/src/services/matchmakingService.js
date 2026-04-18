const profileRepository = require('../repositories/profileRepository');
const userRepository = require('../repositories/userRepository');
const { DEFAULT_WEIGHTS, passesFilters, scoreProfiles } = require('../utils/matchScoring');

async function getMatches({
  userId,
  limit = 5,
  weights = DEFAULT_WEIGHTS,
  filters = {},
}) {
  if (!(await userRepository.findById(userId))) {
    const err = new Error('user not found');
    err.statusCode = 404;
    throw err;
  }

  const targetProfile = await profileRepository.findByUserId(userId);
  if (!targetProfile) {
    const err = new Error('profile not found');
    err.statusCode = 404;
    throw err;
  }

  const profiles = await profileRepository.listAll();
  const users = await userRepository.listAll();
  const usernameById = {};

  users.forEach((user) => {
    usernameById[String(user._id)] = user.username;
  });

  return profiles
    .filter((profile) => profile.userId !== userId)
    .filter((profile) => passesFilters(targetProfile, profile, filters))
    .map((profile) => ({
      userId: profile.userId,
      username: usernameById[String(profile.userId)] || profile.userId,
      ...scoreProfiles(targetProfile, profile, weights),
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit);
}

module.exports = {
  getMatches,
};
