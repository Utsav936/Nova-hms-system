/**
 * Wraps an async route handler to catch rejected promises
 * and forward them to the Express error handler.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = catchAsync;
