const profileRepository = require('../repositories/profileRepository');
const userRepository = require('../repositories/userRepository');
const { scoreProfiles } = require('../utils/matchScoring');

async function getMatches({ userId, limit = 5, weights = { skill: 0.5, behavior: 0.5 } }) {
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

  return profiles
    .filter((profile) => profile.userId !== userId)
    .map((profile) => ({
      userId: profile.userId,
      ...scoreProfiles(targetProfile, profile, weights),
    }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit);
}

module.exports = {
  getMatches,
};
