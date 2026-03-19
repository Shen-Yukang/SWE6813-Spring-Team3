const authService = require('../../src/services/authService');
const profileService = require('../../src/services/profileService');
const matchmakingService = require('../../src/services/matchmakingService');
const { connectTestDb, clearTestDb, disconnectTestDb } = require('../testDb');

describe('core services', () => {
  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  test('register creates user', async () => {
    const user = await authService.register({ username: 'alice', password: 'pass123' });
    expect(String(user._id)).toBeTruthy();
    expect(user.username).toBe('alice');
  });

  test('register rejects duplicate username', async () => {
    await authService.register({ username: 'alice', password: 'pass123' });
    await expect(authService.register({ username: 'alice', password: 'pass123' })).rejects.toThrow(
      'username already exists'
    );
  });

  test('login returns token for valid credentials', async () => {
    await authService.register({ username: 'alice', password: 'pass123' });
    const result = await authService.login({ username: 'alice', password: 'pass123' });
    expect(result.token).toBeTruthy();
    expect(result.user.username).toBe('alice');
  });

  test('login rejects invalid credentials', async () => {
    await authService.register({ username: 'alice', password: 'pass123' });
    await expect(authService.login({ username: 'alice', password: 'bad' })).rejects.toThrow(
      'invalid credentials'
    );
  });

  test('upsertProfile stores profile', async () => {
    const user = await authService.register({ username: 'alice', password: 'pass123' });
    const profile = await profileService.upsertProfile({
      userId: String(user._id),
      skillScore: 85,
      behaviorMetrics: { teamwork: 90 },
      preferences: { mode: 'ranked' },
    });

    expect(profile.userId).toBe(String(user._id));
    expect(profile.skillScore).toBe(85);
  });

  test('upsertProfile rejects missing user', async () => {
    await expect(
      profileService.upsertProfile({ userId: 'missing', skillScore: 85, behaviorMetrics: {} })
    ).rejects.toThrow('user not found');
  });

  test('matchmaking ranks players in score order', async () => {
    const a = await authService.register({ username: 'a', password: '1' });
    const b = await authService.register({ username: 'b', password: '1' });
    const c = await authService.register({ username: 'c', password: '1' });

    await profileService.upsertProfile({
      userId: String(a._id),
      skillScore: 80,
      behaviorMetrics: { teamwork: 80, comms: 80 },
      preferences: {},
    });
    await profileService.upsertProfile({
      userId: String(b._id),
      skillScore: 78,
      behaviorMetrics: { teamwork: 79, comms: 81 },
      preferences: {},
    });
    await profileService.upsertProfile({
      userId: String(c._id),
      skillScore: 30,
      behaviorMetrics: { teamwork: 20, comms: 20 },
      preferences: {},
    });

    const matches = await matchmakingService.getMatches({ userId: String(a._id), limit: 2 });
    expect(matches).toHaveLength(2);
    expect(matches[0].userId).toBe(String(b._id));
  });

  test('matchmaking weights can change ranking order', async () => {
    const a = await authService.register({ username: 'weight-a', password: '1' });
    const b = await authService.register({ username: 'weight-b', password: '1' });
    const c = await authService.register({ username: 'weight-c', password: '1' });

    await profileService.upsertProfile({
      userId: String(a._id),
      skillScore: 80,
      behaviorMetrics: { teamwork: 50, comms: 50 },
      preferences: { region: 'NA', gameMode: 'ranked', playStyle: 'support' },
    });
    await profileService.upsertProfile({
      userId: String(b._id),
      skillScore: 79,
      behaviorMetrics: { teamwork: 10, comms: 10 },
      preferences: { region: 'EU', gameMode: 'casual', playStyle: 'duelist' },
    });
    await profileService.upsertProfile({
      userId: String(c._id),
      skillScore: 55,
      behaviorMetrics: { teamwork: 50, comms: 50 },
      preferences: { region: 'NA', gameMode: 'ranked', playStyle: 'support' },
    });

    const skillWeighted = await matchmakingService.getMatches({
      userId: String(a._id),
      limit: 2,
      weights: { skill: 1, behavior: 0, preference: 0 },
    });
    const preferenceWeighted = await matchmakingService.getMatches({
      userId: String(a._id),
      limit: 2,
      weights: { skill: 0.1, behavior: 0, preference: 0.9 },
    });

    expect(skillWeighted[0].userId).toBe(String(b._id));
    expect(preferenceWeighted[0].userId).toBe(String(c._id));
  });

  test('matchmaking filters candidates before scoring', async () => {
    const a = await authService.register({ username: 'filter-a', password: '1' });
    const b = await authService.register({ username: 'filter-b', password: '1' });
    const c = await authService.register({ username: 'filter-c', password: '1' });

    await profileService.upsertProfile({
      userId: String(a._id),
      skillScore: 80,
      behaviorMetrics: { teamwork: 80, comms: 80 },
      preferences: { region: 'NA', gameMode: 'ranked', playStyle: 'support' },
    });
    await profileService.upsertProfile({
      userId: String(b._id),
      skillScore: 78,
      behaviorMetrics: { teamwork: 79, comms: 81 },
      preferences: { region: 'NA', gameMode: 'ranked', playStyle: 'support' },
    });
    await profileService.upsertProfile({
      userId: String(c._id),
      skillScore: 79,
      behaviorMetrics: { teamwork: 80, comms: 80 },
      preferences: { region: 'EU', gameMode: 'ranked', playStyle: 'support' },
    });

    const matches = await matchmakingService.getMatches({
      userId: String(a._id),
      limit: 5,
      filters: { region: 'NA', maxSkillGap: 5 },
    });

    expect(matches).toHaveLength(1);
    expect(matches[0].userId).toBe(String(b._id));
  });

  test('matchmaking rejects unknown user', async () => {
    await expect(matchmakingService.getMatches({ userId: 'unknown' })).rejects.toThrow('user not found');
  });

  test('matchmaking rejects missing profile', async () => {
    const user = await authService.register({ username: 'x', password: '1' });
    await expect(matchmakingService.getMatches({ userId: String(user._id) })).rejects.toThrow(
      'profile not found'
    );
  });
});
