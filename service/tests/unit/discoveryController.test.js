jest.mock('../../src/services/discoveryService', () => ({
  searchPlayers: jest.fn(),
}));

const discoveryController = require('../../src/controllers/discoveryController');
const discoveryService = require('../../src/services/discoveryService');

function createResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe('discoveryController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns players with default limit when no query params given', async () => {
    const req = { query: {} };
    const res = createResponse();
    const next = jest.fn();

    discoveryService.searchPlayers.mockResolvedValue([]);

    await discoveryController.searchPlayers(req, res, next);

    expect(discoveryService.searchPlayers).toHaveBeenCalledWith(
      expect.objectContaining({ query: '', limit: 20 })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ players: [] });
    expect(next).not.toHaveBeenCalled();
  });

  test('passes query string and filters to service', async () => {
    const req = {
      query: {
        q: 'alice',
        skillMin: '50',
        skillMax: '90',
        region: 'NA',
        gameMode: 'ranked',
        playStyle: 'support',
        limit: '10',
      },
    };
    const res = createResponse();
    const next = jest.fn();
    const mockPlayers = [{ id: 'u1', username: 'alice', skillScore: 75 }];

    discoveryService.searchPlayers.mockResolvedValue(mockPlayers);

    await discoveryController.searchPlayers(req, res, next);

    expect(discoveryService.searchPlayers).toHaveBeenCalledWith({
      query: 'alice',
      skillMin: 50,
      skillMax: 90,
      region: 'NA',
      gameMode: 'ranked',
      playStyle: 'support',
      limit: 10,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ players: mockPlayers });
  });

  test('forwards service errors to next middleware', async () => {
    const req = { query: {} };
    const res = createResponse();
    const next = jest.fn();
    const error = new Error('db failure');

    discoveryService.searchPlayers.mockRejectedValue(error);

    await discoveryController.searchPlayers(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('passes undefined skillMin/skillMax when those params are absent', async () => {
    const req = { query: { q: 'bob' } };
    const res = createResponse();
    const next = jest.fn();

    discoveryService.searchPlayers.mockResolvedValue([]);

    await discoveryController.searchPlayers(req, res, next);

    expect(discoveryService.searchPlayers).toHaveBeenCalledWith(
      expect.objectContaining({ skillMin: undefined, skillMax: undefined })
    );
  });

  test('returns empty players array when service returns no results', async () => {
    const req = { query: { q: 'nobody' } };
    const res = createResponse();
    const next = jest.fn();

    discoveryService.searchPlayers.mockResolvedValue([]);

    await discoveryController.searchPlayers(req, res, next);

    expect(res.json).toHaveBeenCalledWith({ players: [] });
  });

  test('uses custom limit from query param', async () => {
    const req = { query: { limit: '5' } };
    const res = createResponse();
    const next = jest.fn();

    discoveryService.searchPlayers.mockResolvedValue([]);

    await discoveryController.searchPlayers(req, res, next);

    expect(discoveryService.searchPlayers).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 5 })
    );
  });
});
