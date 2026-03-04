const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../logging/logger');

async function connectDb() {
  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  logger.info('database connected', {
    requestId: null,
    route: 'system',
    userId: null,
    metadata: {
      mongoUri: env.mongoUri,
    },
  });
}

async function disconnectDb() {
  await mongoose.disconnect();
}

module.exports = {
  connectDb,
  disconnectDb,
};
