const Profile = require('../models/profileModel');

async function upsert(profile) {
  const doc = await Profile.findOneAndUpdate({ userId: profile.userId }, profile, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  }).lean();
  return doc;
}

async function findByUserId(userId) {
  return Profile.findOne({ userId }).lean();
}

async function listAll() {
  return Profile.find({}).lean();
}

module.exports = {
  upsert,
  findByUserId,
  listAll,
};
