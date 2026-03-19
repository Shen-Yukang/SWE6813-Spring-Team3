const matchmakingService = require('../services/matchmakingService');

function buildBadRequest(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

function parseOptionalNumber(value, name) {
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw buildBadRequest(`${name} must be a non-negative number`);
  }

  return parsed;
}

function parseLimit(value) {
  if (value === undefined) {
    return 5;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw buildBadRequest('limit must be a positive integer');
  }

  return parsed;
}

function parseOptionalString(value) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed || undefined;
}

async function getMatches(req, res, next) {
  try {
    const weights = {
      skill: parseOptionalNumber(req.query.wSkill, 'wSkill'),
      behavior: parseOptionalNumber(req.query.wBehavior, 'wBehavior'),
      preference: parseOptionalNumber(req.query.wPreference, 'wPreference'),
    };

    const filters = {
      maxSkillGap: parseOptionalNumber(req.query.maxSkillGap, 'maxSkillGap'),
      region: parseOptionalString(req.query.region),
      gameMode: parseOptionalString(req.query.gameMode),
      playStyle: parseOptionalString(req.query.playStyle),
    };

    const matches = await matchmakingService.getMatches({
      userId: req.params.userId,
      limit: parseLimit(req.query.limit),
      weights,
      filters,
    });
    res.status(200).json({ matches });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMatches,
};
