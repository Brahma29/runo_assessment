export const errorHandler = (err, req, res, next) => {
  let errorStatus = err.statusCode || 500;
  let errorMessage = err.message || "Something went wrong!";
  let stack = process.env.NODE_ENV === "development" ? err.stack : {};

  if (err.name === "ValidationError") {
    errorStatus = 400;
    errorMessage = "Validation error";

    const validationErrors = {};
    Object.keys(err.errors).map((e) => {
      validationErrors[e] = err.errors[e].message;
    });

    return res.status(errorStatus).json({
      success: false,
      message: errorMessage,
      errors: validationErrors,
      stack,
    });
  }

  return res.status(errorStatus).json({
    success: false,
    message: errorMessage,
    stack,
  });
};
