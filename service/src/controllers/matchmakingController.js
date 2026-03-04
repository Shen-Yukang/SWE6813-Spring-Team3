const matchmakingService = require('../services/matchmakingService');

async function getMatches(req, res, next) {
  try {
    const matches = await matchmakingService.getMatches({
      userId: req.params.userId,
      limit: Number(req.query.limit || 5),
      weights: {
        skill: Number(req.query.wSkill || 0.5),
        behavior: Number(req.query.wBehavior || 0.5),
      },
    });
    res.status(200).json({ matches });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMatches,
};
