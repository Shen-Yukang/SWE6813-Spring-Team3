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
  });
});
