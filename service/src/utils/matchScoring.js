function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

const DEFAULT_WEIGHTS = {
  skill: 0.5,
  behavior: 0.5,
  preference: 0,
};

const PREFERENCE_FIELDS = ['region', 'gameMode', 'playStyle'];

function isValidWeight(value) {
  return Number.isFinite(value) && value >= 0;
}

function normalizeWeights(weights = {}, defaults = DEFAULT_WEIGHTS) {
  const merged = Object.keys(defaults).reduce((result, key) => {
    const value = Number(weights[key]);
    const fallback = Number(defaults[key]);
    result[key] = isValidWeight(value) ? value : fallback;
    return result;
  }, {});

  const total = Object.values(merged).reduce((sum, value) => sum + value, 0);
  if (total <= 0) {
    const fallbackTotal = Object.values(defaults).reduce((sum, value) => sum + value, 0) || 1;
    return Object.keys(defaults).reduce((result, key) => {
      result[key] = defaults[key] / fallbackTotal;
      return result;
    }, {});
  }

  return Object.keys(merged).reduce((result, key) => {
    result[key] = merged[key] / total;
    return result;
  }, {});
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

function normalizePreferenceValue(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().toLowerCase();
}

function preferenceCompatibility(preferencesA = {}, preferencesB = {}) {
  const comparableFields = PREFERENCE_FIELDS.filter((field) => {
    const valueA = normalizePreferenceValue(preferencesA[field]);
    const valueB = normalizePreferenceValue(preferencesB[field]);
    return valueA && valueB;
  });

  if (comparableFields.length === 0) {
    return 0;
  }

  const matches = comparableFields.reduce((sum, field) => {
    const valueA = normalizePreferenceValue(preferencesA[field]);
    const valueB = normalizePreferenceValue(preferencesB[field]);
    return sum + (valueA === valueB ? 1 : 0);
  }, 0);

  return matches / comparableFields.length;
}

function passesFilters(targetProfile, candidateProfile, filters = {}) {
  const maxSkillGap = Number(filters.maxSkillGap);
  if (Number.isFinite(maxSkillGap) && maxSkillGap >= 0) {
    const gap = Math.abs((targetProfile.skillScore || 0) - (candidateProfile.skillScore || 0));
    if (gap > maxSkillGap) {
      return false;
    }
  }

  return PREFERENCE_FIELDS.every((field) => {
    const filterValue = normalizePreferenceValue(filters[field]);
    if (!filterValue) {
      return true;
    }

    return normalizePreferenceValue(candidateProfile.preferences?.[field]) === filterValue;
  });
}

function scoreProfiles(profileA, profileB, weights = DEFAULT_WEIGHTS) {
  const normalizedWeights = normalizeWeights(weights, DEFAULT_WEIGHTS);
  const skill = skillSimilarity(profileA.skillScore, profileB.skillScore);
  const behavior = behaviorSimilarity(profileA.behaviorMetrics, profileB.behaviorMetrics);
  const preference = preferenceCompatibility(profileA.preferences, profileB.preferences);
  const totalScore =
    skill * normalizedWeights.skill +
    behavior * normalizedWeights.behavior +
    preference * normalizedWeights.preference;

  return {
    totalScore,
    breakdown: {
      skillSimilarity: skill,
      behaviorSimilarity: behavior,
      preferenceCompatibility: preference,
    },
  };
}

module.exports = {
  DEFAULT_WEIGHTS,
  normalizeWeights,
  preferenceCompatibility,
  passesFilters,
  scoreProfiles,
  skillSimilarity,
  behaviorSimilarity,
};
