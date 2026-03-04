const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    ownerId: { type: String, required: true },
    memberIds: { type: [String], default: [] },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

module.exports = mongoose.model('Group', groupSchema);
