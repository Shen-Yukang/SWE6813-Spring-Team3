const request = require('supertest');
const app = require('../../src/app');
const { connectTestDb, clearTestDb, disconnectTestDb } = require('../testDb');

describe('api smoke tests', () => {
  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  test('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('auth + profile + matchmaking happy path', async () => {
    const u1 = await request(app).post('/api/auth/register').send({ username: 'alice', password: 'pw' });
    const u2 = await request(app).post('/api/auth/register').send({ username: 'bob', password: 'pw' });

    await request(app).put(`/api/profile/${u1.body.id}`).send({
      skillScore: 80,
      behaviorMetrics: { teamwork: 80 },
      preferences: {},
    });

    await request(app).put(`/api/profile/${u2.body.id}`).send({
      skillScore: 78,
      behaviorMetrics: { teamwork: 79 },
      preferences: {},
    });

    const matchRes = await request(app).get(`/api/matchmaking/${u1.body.id}`);
    expect(matchRes.status).toBe(200);
    expect(matchRes.body.matches[0].userId).toBe(u2.body.id);
    expect(matchRes.body.matches[0].username).toBe('bob');
  });

  test('matchmaking accepts filters and preference weight query params', async () => {
    const u1 = await request(app).post('/api/auth/register').send({ username: 'query-alice', password: 'pw' });
    const u2 = await request(app).post('/api/auth/register').send({ username: 'query-bob', password: 'pw' });
    const u3 = await request(app).post('/api/auth/register').send({ username: 'query-carl', password: 'pw' });

    await request(app).put(`/api/profile/${u1.body.id}`).send({
      skillScore: 80,
      behaviorMetrics: { teamwork: 60 },
      preferences: { region: 'NA', gameMode: 'ranked', playStyle: 'support' },
    });

    await request(app).put(`/api/profile/${u2.body.id}`).send({
      skillScore: 65,
      behaviorMetrics: { teamwork: 60 },
      preferences: { region: 'NA', gameMode: 'ranked', playStyle: 'support' },
    });

    await request(app).put(`/api/profile/${u3.body.id}`).send({
      skillScore: 79,
      behaviorMetrics: { teamwork: 60 },
      preferences: { region: 'EU', gameMode: 'ranked', playStyle: 'support' },
    });

    const matchRes = await request(app)
      .get(`/api/matchmaking/${u1.body.id}`)
      .query({ wPreference: 1, wSkill: 0, wBehavior: 0, region: 'NA', gameMode: 'ranked' });

    expect(matchRes.status).toBe(200);
    expect(matchRes.body.matches).toHaveLength(1);
    expect(matchRes.body.matches[0].userId).toBe(u2.body.id);
    expect(matchRes.body.matches[0].username).toBe('query-bob');
    expect(matchRes.body.matches[0].breakdown.preferenceCompatibility).toBe(1);
  });

  test('discovery returns players matching username query', async () => {
    await request(app).post('/api/auth/register').send({ username: 'alpha', password: 'pw' });
    await request(app).post('/api/auth/register').send({ username: 'beta', password: 'pw' });

    const res = await request(app).get('/api/discovery').query({ q: 'alp' });
    expect(res.status).toBe(200);
    expect(res.body.players).toHaveLength(1);
    expect(res.body.players[0].username).toBe('alpha');
  });

  test('discovery filters by skill range', async () => {
    const u1 = await request(app).post('/api/auth/register').send({ username: 'skill-high', password: 'pw' });
    const u2 = await request(app).post('/api/auth/register').send({ username: 'skill-low', password: 'pw' });

    await request(app).put(`/api/profile/${u1.body.id}`).send({ skillScore: 90, behaviorMetrics: {}, preferences: {} });
    await request(app).put(`/api/profile/${u2.body.id}`).send({ skillScore: 30, behaviorMetrics: {}, preferences: {} });

    const res = await request(app).get('/api/discovery').query({ skillMin: 80, skillMax: 100 });
    expect(res.status).toBe(200);
    expect(res.body.players.some((p) => p.username === 'skill-high')).toBe(true);
    expect(res.body.players.some((p) => p.username === 'skill-low')).toBe(false);
  });

  test('discovery filters by region preference', async () => {
    const u1 = await request(app).post('/api/auth/register').send({ username: 'na-player', password: 'pw' });
    const u2 = await request(app).post('/api/auth/register').send({ username: 'eu-player', password: 'pw' });

    await request(app).put(`/api/profile/${u1.body.id}`).send({ skillScore: 60, behaviorMetrics: {}, preferences: { region: 'NA' } });
    await request(app).put(`/api/profile/${u2.body.id}`).send({ skillScore: 60, behaviorMetrics: {}, preferences: { region: 'EU' } });

    const res = await request(app).get('/api/discovery').query({ region: 'NA' });
    expect(res.status).toBe(200);
    expect(res.body.players.some((p) => p.username === 'na-player')).toBe(true);
    expect(res.body.players.some((p) => p.username === 'eu-player')).toBe(false);
  });

  test('matchmaking rejects invalid numeric query params', async () => {
    const user = await request(app).post('/api/auth/register').send({ username: 'bad-query', password: 'pw' });

    await request(app).put(`/api/profile/${user.body.id}`).send({
      skillScore: 80,
      behaviorMetrics: { teamwork: 80 },
      preferences: {},
    });

    const matchRes = await request(app).get(`/api/matchmaking/${user.body.id}`).query({ wSkill: 'abc' });

    expect(matchRes.status).toBe(400);
    expect(matchRes.body.message).toBe('wSkill must be a non-negative number');
  });
});
