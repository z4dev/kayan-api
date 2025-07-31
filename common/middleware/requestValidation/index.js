import { StatusCodes } from "http-status-codes";

const { BAD_REQUEST } = StatusCodes;

const validateRequest = (schema) => {
  const joiValidationOptions = {
    abortEarly: true,
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
      res.status(BAD_REQUEST).send(error.details[0].message);
    }
  };
};

export default validateRequest;
