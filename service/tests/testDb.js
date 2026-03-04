const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

async function connectTestDb() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}

async function clearTestDb() {
  const collections = mongoose.connection.collections;
  const tasks = Object.keys(collections).map((key) => collections[key].deleteMany({}));
  await Promise.all(tasks);
}

async function disconnectTestDb() {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
}

module.exports = {
  connectTestDb,
  clearTestDb,
  disconnectTestDb,
};
