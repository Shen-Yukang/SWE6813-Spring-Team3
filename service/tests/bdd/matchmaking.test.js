const { loadFeature, defineFeature } = require('jest-cucumber');
const authService = require('../../src/services/authService');
const profileService = require('../../src/services/profileService');
const matchmakingService = require('../../src/services/matchmakingService');
const { connectTestDb, clearTestDb, disconnectTestDb } = require('../testDb');

const feature = loadFeature('./tests/bdd/matchmaking.feature');

defineFeature(feature, (test) => {
  let users = {};
  let results = [];

  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
    users = {};
    results = [];
  });

  test('Player gets ranked recommendations using skill and behavior', ({ given, when, then }) => {
    given('users and profiles exist in the system', async () => {
      users.alice = await authService.register({ username: 'alice', password: 'pw' });
      users.bob = await authService.register({ username: 'bob', password: 'pw' });
      users.carl = await authService.register({ username: 'carl', password: 'pw' });

      await profileService.upsertProfile({
        userId: String(users.alice._id),
        skillScore: 70,
        behaviorMetrics: { teamwork: 80, comms: 80 },
        preferences: {},
      });
      await profileService.upsertProfile({
        userId: String(users.bob._id),
        skillScore: 72,
        behaviorMetrics: { teamwork: 79, comms: 81 },
        preferences: {},
      });
      await profileService.upsertProfile({
        userId: String(users.carl._id),
        skillScore: 20,
        behaviorMetrics: { teamwork: 20, comms: 20 },
        preferences: {},
      });
    });

    when(/^player "(.*)" requests matchmaking$/, async (playerName) => {
      results = await matchmakingService.getMatches({ userId: String(users[playerName]._id), limit: 2 });
    });

    then(/^the first recommendation should be "(.*)"$/, (candidateName) => {
      expect(results[0].userId).toBe(String(users[candidateName]._id));
    });
  });

  test('Player gets filtered recommendations by region and game mode', ({ given, when, then }) => {
    given('users and profiles exist for filtered matchmaking', async () => {
      users.alice = await authService.register({ username: 'filtered-alice', password: 'pw' });
      users.bob = await authService.register({ username: 'filtered-bob', password: 'pw' });
      users.carl = await authService.register({ username: 'filtered-carl', password: 'pw' });

      await profileService.upsertProfile({
        userId: String(users.alice._id),
        skillScore: 70,
        behaviorMetrics: { teamwork: 80, comms: 80 },
        preferences: { region: 'NA', gameMode: 'ranked', playStyle: 'support' },
      });
      await profileService.upsertProfile({
        userId: String(users.bob._id),
        skillScore: 72,
        behaviorMetrics: { teamwork: 79, comms: 81 },
        preferences: { region: 'NA', gameMode: 'ranked', playStyle: 'support' },
      });
      await profileService.upsertProfile({
        userId: String(users.carl._id),
        skillScore: 71,
        behaviorMetrics: { teamwork: 79, comms: 81 },
        preferences: { region: 'EU', gameMode: 'casual', playStyle: 'support' },
      });
    });

    when(
      /^player "(.*)" requests matchmaking with region "(.*)" and game mode "(.*)"$/,
      async (playerName, region, gameMode) => {
        results = await matchmakingService.getMatches({
          userId: String(users[playerName]._id),
          limit: 5,
          filters: { region, gameMode },
        });
      }
    );

    then(/^the filtered recommendations should only include "(.*)"$/, (candidateName) => {
      expect(results).toHaveLength(1);
      expect(results[0].userId).toBe(String(users[candidateName]._id));
    });
  });
});
