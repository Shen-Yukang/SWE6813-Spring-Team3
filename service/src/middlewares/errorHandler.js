const logger = require('../logging/logger');

function errorHandler(err, req, res, _next) {
  logger.error('request failed', {
    requestId: req.context?.requestId,
    route: `${req.method} ${req.originalUrl}`,
    userId: req.context?.userId || null,
    metadata: {
      error: err.message,
    },
  });

  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
