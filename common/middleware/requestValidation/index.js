import { StatusCodes } from "http-status-codes";

const { BAD_REQUEST } = StatusCodes;

const validateRequest = (schema) => {
  const joiValidationOptions = {
    abortEarly: false,
    allowUnknown: true,
  };

  return async (req, res, next) => {
    const validations = ["headers", "params", "query", "body"];

    try {
      for (const key of validations) {
        const expectedSchema = schema[key];
        const actualValue = req[key];

        if (expectedSchema) {
          await expectedSchema.validateAsync(actualValue, joiValidationOptions);
        }
      }
      next();
    } catch (error) {
      const errors =
        error.details?.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message.replace(/['"]/g, ""),
        })) || [];

      res.status(BAD_REQUEST).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }
  };
};

export default validateRequest;
