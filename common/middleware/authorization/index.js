import { StatusCodes } from "http-status-codes";
import _ from "lodash";
import { ALLOWED_ENDPOINTS_FOR_UNVERIFIED_USERS } from "../../../server/users/helpers/constants.js";
import { errorCodes } from "../../helpers/constants.js";

export default class Authorization {
  static isAuthorizedResource(permissions, userRole) {
    return permissions.includes(userRole);
  }

  static Authorize = (permissions, endpoint) => {
    return (req, res, next) => {
      const user = req.user;
      const userRole = _.get(user, "role", null);

      if (!user || !userRole)
        return res.status(StatusCodes.FORBIDDEN).json({
          message: errorCodes.USER_NOT_AUTHORIZED.message,
          statusCode: StatusCodes.FORBIDDEN,
          errorCode: errorCodes.USER_NOT_AUTHORIZED.code,
        });

      if (!this.isAuthorizedResource(permissions, userRole))
        return res.status(StatusCodes.FORBIDDEN).json({
          message: errorCodes.USER_NOT_AUTHORIZED.message,
          statusCode: StatusCodes.FORBIDDEN,
          errorCode: errorCodes.USER_NOT_AUTHORIZED.code,
        });

      if (
        !user.isVerified &&
        !ALLOWED_ENDPOINTS_FOR_UNVERIFIED_USERS.includes(endpoint)
      )
        return res.status(StatusCodes.FORBIDDEN).json({
          message: errorCodes.VERIFY_YOUR_EMAIL.message,
          statusCode: StatusCodes.FORBIDDEN,
          errorCode: errorCodes.VERIFY_YOUR_EMAIL.code,
        });

      next();
    };
  };
}
