const {
  skillSimilarity,
  behaviorSimilarity,
  scoreProfiles,
} = require('../../src/utils/matchScoring');

describe('matchScoring utility', () => {
  test('skillSimilarity returns 1 for identical scores', () => {
    expect(skillSimilarity(80, 80)).toBe(1);
  });

  test('skillSimilarity decreases with score gap', () => {
    expect(skillSimilarity(80, 60)).toBeCloseTo(0.8, 5);
  });

  test('skillSimilarity clamps to 0', () => {
    expect(skillSimilarity(0, 1000)).toBe(0);
  });

  test('behaviorSimilarity returns 0 if no shared metrics', () => {
    expect(behaviorSimilarity({ a: 10 }, { b: 10 })).toBe(0);
  });

  test('behaviorSimilarity returns 1 for identical metrics', () => {
    expect(behaviorSimilarity({ teamwork: 90 }, { teamwork: 90 })).toBe(1);
  });

  test('behaviorSimilarity averages across metrics', () => {
    const value = behaviorSimilarity(
      { teamwork: 100, comms: 50 },
      { teamwork: 90, comms: 30 }
    );
    expect(value).toBeCloseTo((0.9 + 0.8) / 2, 5);
  });

  test('scoreProfiles returns total with breakdown', () => {
    const result = scoreProfiles(
      { skillScore: 80, behaviorMetrics: { teamwork: 90 } },
      { skillScore: 70, behaviorMetrics: { teamwork: 80 } },
      { skill: 0.6, behavior: 0.4 }
    );

    expect(result).toHaveProperty('totalScore');
    expect(result.breakdown).toEqual({
      skillSimilarity: 0.9,
      behaviorSimilarity: 0.9,
    });
    expect(result.totalScore).toBeCloseTo(0.9, 5);
  });
});
