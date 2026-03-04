const { createId } = require('../utils/id');

function requestContext(req, _res, next) {
  req.context = {
    requestId: createId('req'),
    startedAt: Date.now(),
    userId: req.headers['x-user-id'] || null,
  };
  next();
}

module.exports = requestContext;
