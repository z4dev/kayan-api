import { StatusCodes } from "http-status-codes";
import _ from "lodash";
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

  [CONTROLLERS.REGISTER_DOCTOR]: async (req, res, next) => {
    try {
      const data = await usersService.registerDoctor(req.body);
      res.status(StatusCodes.CREATED).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.REGISTER_FINANCE]: async (req, res, next) => {
    try {
      const data = await usersService.registerFinance(req.body);
      res.status(StatusCodes.CREATED).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  [CONTROLLERS.GET_PROFILE]: async (req, res, next) => {
    try {
      const userId = _.get(req, "user._id", null);
      console.log(userId);
      const data = await usersService.getProfile(userId);
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.UPDATE_PROFILE]: async (req, res, next) => {
    try {
      const userId = _.get(req, "user._id", null);
      const data = await usersService.updateProfile(userId, req.body);
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.UPDATE_AVAILABILITY]: async (req, res, next) => {
    try {
      const userId = _.get(req, "user._id", null);
      console.log(userId);
      console.log(req.body);
      const data = await usersService.updateAvailability(userId, req.body);
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.LIST_DOCTORS]: async (req, res, next) => {
    try {
      const data = await usersService.listDoctors(req.query);
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.LIST_PATIENTS]: async (req, res, next) => {
    try {
      const data = await usersService.listPatients(req.query);
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
