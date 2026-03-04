const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const requestContext = require('./middlewares/requestContext');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestContext);
app.use(requestLogger);

app.use('/api', apiRoutes);

app.use(errorHandler);

module.exports = app;
