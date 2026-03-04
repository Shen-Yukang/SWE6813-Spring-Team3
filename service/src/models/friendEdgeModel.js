const mongoose = require('mongoose');

const friendEdgeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    friendUserId: { type: String, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

friendEdgeSchema.index({ userId: 1, friendUserId: 1 }, { unique: true });

module.exports = mongoose.model('FriendEdge', friendEdgeSchema);
