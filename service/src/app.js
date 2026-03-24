const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const requestContext = require('./middlewares/requestContext');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');
const env = require('./config/env');

const app = express();

const corsOptions = env.corsOrigins.length
  ? {
      origin(origin, callback) {
        if (!origin || env.corsOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error('origin not allowed by cors'));
      },
    }
  : {};

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestContext);
app.use(requestLogger);

app.use('/api', apiRoutes);

app.use(errorHandler);

module.exports = app;
