const { loadFeature, defineFeature } = require('jest-cucumber');
const authService = require('../../src/services/authService');
const profileService = require('../../src/services/profileService');
const discoveryService = require('../../src/services/discoveryService');
const { connectTestDb, clearTestDb, disconnectTestDb } = require('../testDb');

const feature = loadFeature('./tests/bdd/discovery.feature');

defineFeature(feature, (test) => {
  let results = [];

  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
    results = [];
  });

  test('Player searches by username and region filter', ({ given, when, then }) => {
    given('players exist with different regions', async () => {
      const u1 = await authService.register({ username: 'player-na', password: 'pw' });
      const u2 = await authService.register({ username: 'player-eu', password: 'pw' });
      const u3 = await authService.register({ username: 'player-na2', password: 'pw' });

      await profileService.upsertProfile({
        userId: String(u1._id),
        skillScore: 60,
        behaviorMetrics: {},
        preferences: { region: 'NA' },
      });
      await profileService.upsertProfile({
        userId: String(u2._id),
        skillScore: 65,
        behaviorMetrics: {},
        preferences: { region: 'EU' },
      });
      await profileService.upsertProfile({
        userId: String(u3._id),
        skillScore: 70,
        behaviorMetrics: {},
        preferences: { region: 'NA' },
      });
    });

    when(/^a user searches for players with region "(.*)"$/, async (region) => {
      results = await discoveryService.searchPlayers({ region });
    });

    then(/^only players from region "(.*)" are returned$/, (region) => {
      expect(results.length).toBe(2);
      results.forEach((p) => {
        expect(p.preferences.region).toBe(region);
      });
    });
  });
});
