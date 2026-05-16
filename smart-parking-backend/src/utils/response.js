function success(res, data = {}, status = 200) {
  return res.status(status).json({ success: true, data });
}

function error(res, err) {
  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Internal server error',
    },
  });
}

module.exports = { success, error };
