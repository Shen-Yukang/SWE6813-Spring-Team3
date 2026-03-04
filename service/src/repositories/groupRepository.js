const Group = require('../models/groupModel');

async function create(group) {
  const doc = await Group.create(group);
  return doc.toObject();
}

async function listAll() {
  return Group.find({}).lean();
}

module.exports = {
  create,
  listAll,
};
