const { error } = require('../utils/response');

function notFound(req, _res, next) {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  err.code = 'ROUTE_NOT_FOUND';
  next(err);
}

function errorHandler(err, _req, res, _next) {
  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }
  return error(res, err);
}

module.exports = { notFound, errorHandler };
