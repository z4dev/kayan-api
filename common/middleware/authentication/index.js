import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { JWT_SECRET } from "../../../config/env/index.js";
import { errorCodes, USER_ROLES } from "../../helpers/constant.js";
import { isValidRole } from "../../helpers/isValid.js";
import logger from "../../utils/logger/index.js";

const Authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: errorCodes.USER_NOT_AUTHORIZED.message,
        statusCode: StatusCodes.UNAUTHORIZED,
        errorCode: errorCodes.USER_NOT_AUTHORIZED.code,
      });

    if (
      !authHeader.startsWith("Bearer ") ||
      authHeader.trim().split(" ").length !== 2
    )
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: errorCodes.INVALID_TOKEN.message,
        statusCode: StatusCodes.UNAUTHORIZED,
        errorCode: errorCodes.INVALID_TOKEN.code,
      });

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);
    // get user id from token
    const userId = _.get(decoded, "userId", null);

    if (!userId)
      return res.status(StatusCodes.FORBIDDEN).json({
        message: errorCodes.INVALID_TOKEN.message,
        statusCode: StatusCodes.FORBIDDEN,
        error: errorCodes.INVALID_TOKEN.code,
      });

    const userRole = _.get(user, "role", null);

    if (!isValidRole(userRole, USER_ROLES)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: errorCodes.USER_NOT_AUTHORIZED.message,
        statusCode: StatusCodes.FORBIDDEN,
        errorCode: errorCodes.USER_NOT_AUTHORIZED.code,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error(`Error in authenticateToken middleware: ${error.message}`);
    next(error);
  }
};

export default Authenticate;
