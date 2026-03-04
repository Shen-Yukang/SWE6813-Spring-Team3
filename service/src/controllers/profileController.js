const profileService = require('../services/profileService');

async function upsertProfile(req, res, next) {
  try {
    const profile = await profileService.upsertProfile({
      userId: req.params.userId,
      ...req.body,
    });
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    const profile = await profileService.getProfile(req.params.userId);
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  upsertProfile,
  getProfile,
};
