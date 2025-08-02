import { StatusCodes } from "http-status-codes";
import _ from "lodash";
import { errorCodes } from "../../helpers/constant.js";

export default class Authorization {
  static isAuthorizedResource(permissions, userRole) {
    return permissions.includes(userRole);
  }

  static Authorize = (permissions) => {
    return (req, res, next) => {
      const user = req.user;
      const userRole = _.get(user, "userType", null);

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

      next();
    };
  };
}
