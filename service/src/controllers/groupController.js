const groupService = require('../services/groupService');

async function createGroup(req, res, next) {
  try {
    const group = await groupService.createGroup(req.body);
    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
}

async function listGroups(_req, res, next) {
  try {
    res.status(200).json({ groups: await groupService.listGroups() });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createGroup,
  listGroups,
};
