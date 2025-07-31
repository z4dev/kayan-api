import { StatusCodes } from "http-status-codes";
import logger from "../../../common/utils/logger/index.js";
import { CONTROLLERS } from "../helpers/constant.js";
import usersService from "../service/usersService.js";

export default {
  [CONTROLLERS.LOGIN]: async (req, res, next) => {
    try {
      const data = await usersService.login(req.body);
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.REGISTER_PATIENT]: async (req, res, next) => {
    try {
      const data = await usersService.registerPatient(req.body);
      res.status(StatusCodes.CREATED).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.LIST_USERS]: async (req, res, next) => {
    try {
      const data = await usersService.listUsers(req.query);
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.GET_USER]: async (req, res, next) => {
    try {
      const data = await usersService.getUser(req.params.id);
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.LIST_DOCTORS]: async (req, res, next) => {
    try {
      const data = await usersService.listDoctors();
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.LIST_PATIENTS]: async (req, res, next) => {
    try {
      const data = await usersService.listPatients();
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.GET_DOCTOR]: async (req, res, next) => {
    try {
      const data = await usersService.getDoctor(req.params.id);
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.GET_PATIENT]: async (req, res, next) => {
    try {
      const data = await usersService.getPatient(req.params.id);
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
};
