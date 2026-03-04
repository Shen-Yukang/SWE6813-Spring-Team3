function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function skillSimilarity(a, b, maxSkill = 100) {
  const diff = Math.abs((a || 0) - (b || 0));
  return clamp(1 - diff / maxSkill, 0, 1);
}

function behaviorSimilarity(metricsA = {}, metricsB = {}) {
  const keys = Object.keys(metricsA).filter((key) => Object.hasOwn(metricsB, key));
  if (keys.length === 0) {
    return 0;
  }

  const score = keys.reduce((sum, key) => {
    const a = Number(metricsA[key]) || 0;
    const b = Number(metricsB[key]) || 0;
    return sum + clamp(1 - Math.abs(a - b) / 100, 0, 1);
  }, 0);

  return score / keys.length;
}

function scoreProfiles(profileA, profileB, weights = { skill: 0.5, behavior: 0.5 }) {
  const skill = skillSimilarity(profileA.skillScore, profileB.skillScore);
  const behavior = behaviorSimilarity(profileA.behaviorMetrics, profileB.behaviorMetrics);
  const totalScore = skill * weights.skill + behavior * weights.behavior;

  return {
    totalScore,
    breakdown: {
      skillSimilarity: skill,
      behaviorSimilarity: behavior,
    },
  };
}

module.exports = {
  scoreProfiles,
  skillSimilarity,
  behaviorSimilarity,
};
