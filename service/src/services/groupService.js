const groupRepository = require('../repositories/groupRepository');

async function createGroup({ ownerId, memberIds = [] }) {
  return groupRepository.create({ ownerId, memberIds });
}

async function listGroups() {
  return groupRepository.listAll();
}

module.exports = {
  createGroup,
  listGroups,
};
