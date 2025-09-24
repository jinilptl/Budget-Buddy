const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res, next);
    } catch (err) {
      next(err); // pass error to global error handler
    }
  };
};


export { asyncHandler as AsyncHandler };