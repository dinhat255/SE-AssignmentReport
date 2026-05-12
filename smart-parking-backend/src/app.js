require('dotenv').config();
require('./data/seed');

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const apiRoutes = require('./routes');
const requestLogger = require('./middleware/requestLogger');
const mockAuth = require('./middleware/mockAuth');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'openapi.yaml'));

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS origin not allowed: ${origin}`));
  },
}));
app.use(express.json());
app.use(requestLogger);
app.use(mockAuth);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
