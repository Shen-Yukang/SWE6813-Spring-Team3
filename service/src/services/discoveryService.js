const userRepository = require('../repositories/userRepository');
const profileRepository = require('../repositories/profileRepository');

async function searchPlayers({ query = '', skillMin, skillMax, region, gameMode, playStyle, limit = 20 }) {
  const users = await userRepository.listAll();
  const profiles = await profileRepository.listAll();

  const profileByUserId = {};
  profiles.forEach((p) => {
    profileByUserId[String(p.userId)] = p;
  });

  const matched = users
    .filter((user) => user.username.toLowerCase().includes(query.toLowerCase()))
    .map((user) => {
      const profile = profileByUserId[String(user._id)] || {};
      return {
        id: String(user._id),
        username: user.username,
        skillScore: profile.skillScore ?? null,
        behaviorMetrics: profile.behaviorMetrics ?? {},
        preferences: profile.preferences ?? {},
      };
    })
    .filter((player) => {
      if (skillMin !== undefined && (player.skillScore === null || player.skillScore < skillMin)) return false;
      if (skillMax !== undefined && (player.skillScore === null || player.skillScore > skillMax)) return false;
      if (region && player.preferences.region !== region) return false;
      if (gameMode && player.preferences.gameMode !== gameMode) return false;
      if (playStyle && player.preferences.playStyle !== playStyle) return false;
      return true;
    });

  return matched.slice(0, limit);
}

module.exports = {
  searchPlayers,
};
