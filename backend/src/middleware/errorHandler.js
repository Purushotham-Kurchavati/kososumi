function notFoundHandler(req, res) {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";
  const payload = {
    error: message
  };
  if (err.details) payload.details = err.details;
  if (status >= 500) console.error(err);
  res.status(status).json(payload);
}

module.exports = { notFoundHandler, errorHandler };
