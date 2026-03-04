const profileRepository = require('../repositories/profileRepository');
const userRepository = require('../repositories/userRepository');

async function upsertProfile({ userId, skillScore, behaviorMetrics, preferences }) {
  if (!(await userRepository.findById(userId))) {
    const err = new Error('user not found');
    err.statusCode = 404;
    throw err;
  }

  if (typeof skillScore !== 'number' || Number.isNaN(skillScore)) {
    const err = new Error('skillScore must be a number');
    err.statusCode = 400;
    throw err;
  }

  return profileRepository.upsert({
    userId,
    skillScore,
    behaviorMetrics: behaviorMetrics || {},
    preferences: preferences || {},
  });
}

async function getProfile(userId) {
  const profile = await profileRepository.findByUserId(userId);
  if (!profile) {
    const err = new Error('profile not found');
    err.statusCode = 404;
    throw err;
  }

  return profile;
}

module.exports = {
  upsertProfile,
  getProfile,
};
