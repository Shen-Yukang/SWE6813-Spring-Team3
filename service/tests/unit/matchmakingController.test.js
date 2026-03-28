jest.mock('../../src/services/matchmakingService', () => ({
  getMatches: jest.fn(),
}));

const matchmakingController = require('../../src/controllers/matchmakingController');
const matchmakingService = require('../../src/services/matchmakingService');

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe('matchmakingController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('passes parsed weights, filters, and limit to the service', async () => {
    const req = {
      params: { userId: 'user-1' },
      query: {
        limit: '3',
        wSkill: '1.5',
        wBehavior: '2',
        wPreference: '0.5',
        maxSkillGap: '10',
        region: ' NA ',
        gameMode: ' ranked ',
        playStyle: ' support ',
      },
    };
    const res = createResponse();
    const next = jest.fn();

    matchmakingService.getMatches.mockResolvedValue([{ userId: 'user-2', totalScore: 0.95 }]);

    await matchmakingController.getMatches(req, res, next);

    expect(matchmakingService.getMatches).toHaveBeenCalledWith({
      userId: 'user-1',
      limit: 3,
      weights: {
        skill: 1.5,
        behavior: 2,
        preference: 0.5,
      },
      filters: {
        maxSkillGap: 10,
        region: 'NA',
        gameMode: 'ranked',
        playStyle: 'support',
      },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ matches: [{ userId: 'user-2', totalScore: 0.95 }] });
    expect(next).not.toHaveBeenCalled();
  });

  test('uses default limit and undefined optional params when query is empty', async () => {
    const req = {
      params: { userId: 'user-1' },
      query: {},
    };
    const res = createResponse();
    const next = jest.fn();

    matchmakingService.getMatches.mockResolvedValue([]);

    await matchmakingController.getMatches(req, res, next);

    expect(matchmakingService.getMatches).toHaveBeenCalledWith({
      userId: 'user-1',
      limit: 5,
      weights: {
        skill: undefined,
        behavior: undefined,
        preference: undefined,
      },
      filters: {
        maxSkillGap: undefined,
        region: undefined,
        gameMode: undefined,
        playStyle: undefined,
      },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ matches: [] });
  });

  test('treats non-string filter values as undefined', async () => {
    const req = {
      params: { userId: 'user-1' },
      query: {
        region: 123,
        gameMode: null,
        playStyle: true,
      },
    };
    const res = createResponse();
    const next = jest.fn();

    matchmakingService.getMatches.mockResolvedValue([]);

    await matchmakingController.getMatches(req, res, next);

    expect(matchmakingService.getMatches).toHaveBeenCalledWith(
      expect.objectContaining({
        filters: {
          maxSkillGap: undefined,
          region: undefined,
          gameMode: undefined,
          playStyle: undefined,
        },
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test('rejects non-numeric skill weight', async () => {
    const req = {
      params: { userId: 'user-1' },
      query: { wSkill: 'abc' },
    };

    await expectControllerError(req, 'wSkill must be a non-negative number', 400);
  });

  test('rejects negative behavior weight', async () => {
    const req = {
      params: { userId: 'user-1' },
      query: { wBehavior: '-1' },
    };

    await expectControllerError(req, 'wBehavior must be a non-negative number', 400);
  });

  test('rejects negative maxSkillGap', async () => {
    const req = {
      params: { userId: 'user-1' },
      query: { maxSkillGap: '-5' },
    };

    await expectControllerError(req, 'maxSkillGap must be a non-negative number', 400);
  });

  test('rejects non-positive limit', async () => {
    const req = {
      params: { userId: 'user-1' },
      query: { limit: '0' },
    };

    await expectControllerError(req, 'limit must be a positive integer', 400);
  });

  test('rejects non-integer limit', async () => {
    const req = {
      params: { userId: 'user-1' },
      query: { limit: '2.5' },
    };

    await expectControllerError(req, 'limit must be a positive integer', 400);
  });

  test('forwards service errors to next', async () => {
    const req = {
      params: { userId: 'user-1' },
      query: {},
    };
    const res = createResponse();
    const next = jest.fn();
    const error = new Error('profile not found');

    matchmakingService.getMatches.mockRejectedValue(error);

    await matchmakingController.getMatches(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

async function expectControllerError(req, message, statusCode) {
  const res = createResponse();
  const next = jest.fn();

  await matchmakingController.getMatches(req, res, next);

  expect(matchmakingService.getMatches).not.toHaveBeenCalled();
  expect(next).toHaveBeenCalledTimes(1);

  const [error] = next.mock.calls[0];
  expect(error.message).toBe(message);
  expect(error.statusCode).toBe(statusCode);
  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
}
