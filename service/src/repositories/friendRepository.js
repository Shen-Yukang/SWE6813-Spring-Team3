const FriendEdge = require('../models/friendEdgeModel');

async function add(edge) {
  const doc = await FriendEdge.create(edge);
  return doc.toObject();
}

async function listByUserId(userId) {
  return FriendEdge.find({ userId }).lean();
}

module.exports = {
  add,
  listByUserId,
};
