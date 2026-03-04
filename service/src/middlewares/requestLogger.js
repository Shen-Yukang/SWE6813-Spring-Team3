const logger = require('../logging/logger');

function requestLogger(req, res, next) {
  res.on('finish', () => {
    const durationMs = Date.now() - req.context.startedAt;
    logger.info('request completed', {
      requestId: req.context.requestId,
      route: `${req.method} ${req.originalUrl}`,
      userId: req.context.userId,
      metadata: {
        statusCode: res.statusCode,
        durationMs,
      },
    });
  });

  next();
}

module.exports = requestLogger;
