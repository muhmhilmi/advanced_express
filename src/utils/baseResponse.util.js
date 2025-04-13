module.exports = function baseResponse(res, success, statusCode, message, payload = null, error = {}) {
    return res.status(statusCode).json({
      success,
      message,
      payload,
      error
    });
  };
  