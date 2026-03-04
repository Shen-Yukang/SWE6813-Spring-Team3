const mongoose = require('mongoose');
const User = require('../models/userModel');

async function create(user) {
  const doc = await User.create(user);
  return doc.toObject();
}

async function findByUsername(username) {
  return User.findOne({ username }).lean();
}

async function findById(id) {
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }
  return User.findById(id).lean();
}

async function listAll() {
  return User.find({}).lean();
}

module.exports = {
  create,
  findByUsername,
  findById,
  listAll,
};
