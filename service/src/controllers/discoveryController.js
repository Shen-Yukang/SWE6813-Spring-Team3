const discoveryService = require('../services/discoveryService');

async function searchPlayers(req, res, next) {
  try {
    const players = await discoveryService.searchPlayers({ query: req.query.q || '' });
    res.status(200).json({ players });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  searchPlayers,
};
