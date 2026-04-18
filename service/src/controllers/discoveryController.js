const discoveryService = require('../services/discoveryService');

async function searchPlayers(req, res, next) {
  try {
    const { q = '', skillMin, skillMax, region, gameMode, playStyle, limit } = req.query;
    const players = await discoveryService.searchPlayers({
      query: q,
      skillMin: skillMin !== undefined ? Number(skillMin) : undefined,
      skillMax: skillMax !== undefined ? Number(skillMax) : undefined,
      region,
      gameMode,
      playStyle,
      limit: limit ? Number(limit) : 20,
    });
    res.status(200).json({ players });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  searchPlayers,
};
