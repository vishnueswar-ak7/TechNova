/**
 * Centralised error handler — must be registered as the last middleware.
 * Converts all errors into a consistent JSON response with a user-friendly
 * message. Stack traces are never leaked to the client.
 */
function errorHandler(err, _req, res, _next) {
  // Log full error server-side for debugging
  console.error('[ScreenSaathi] Error:', err.message, err.stack);

  const status = err.status || 500;
  const userMessage =
    err.userMessage ||
    (status === 413 ? 'The image is too large. Please use a screenshot under 5 MB.' :
     status === 415 ? 'That file type is not supported. Please upload a JPEG, PNG, or WEBP screenshot.' :
     status === 400 ? err.message :
     'Something went wrong on our end. Please try again in a moment.');

  res.status(status).json({ error: userMessage });
}

module.exports = errorHandler;
