import { StatusCodes } from "http-status-codes";
import logger from "../../../common/utils/logger/index.js";
import { CONTROLLERS } from "../helpers/constant.js";
import visitsService from "../service/visitsService.js";

export default {
  [CONTROLLERS.CREATE_VISIT]: async (req, res, next) => {
    try {
      
      const data = await visitsService.createVisit(req.body);
      res.status(StatusCodes.CREATED).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.LIST_VISITS]: async (req, res, next) => {
    try {
      const data = await visitsService.listVisits(req.query);
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.GET_VISIT]: async (req, res, next) => {
    try {
      const data = await visitsService.getVisit(req.params.id);
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.START_VISIT]: async (req, res, next) => {
    try {
      const data = await visitsService.startVisit(req.params.id, req.user.id);
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.END_VISIT]: async (req, res, next) => {
    try {
      const data = await visitsService.endVisit(req.params.id, req.user.id);
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.ADD_TREATMENT]: async (req, res, next) => {
    try {
      const data = await visitsService.addTreatment(
        req.params.id,
        req.body,
        req.user.id
      );
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.UPDATE_TREATMENT]: async (req, res, next) => {
    try {
      const data = await visitsService.updateTreatment(
        req.params.visitId,
        req.params.treatmentId,
        req.body,
        req.user.id
      );
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.REMOVE_TREATMENT]: async (req, res, next) => {
    try {
      const data = await visitsService.removeTreatment(
        req.params.visitId,
        req.params.treatmentId,
        req.user.id
      );
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.UPDATE_VISIT_NOTES]: async (req, res, next) => {
    try {
      const data = await visitsService.updateVisitNotes(
        req.params.id,
        req.body,
        req.user.id
      );
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.SEARCH_VISITS]: async (req, res, next) => {
    try {
      const data = await visitsService.searchVisits(req.query);
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.GET_DOCTOR_ACTIVE_VISIT]: async (req, res, next) => {
    try {
      const data = await visitsService.getDoctorActiveVisit(req.user.id);
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.GET_PATIENT_VISITS]: async (req, res, next) => {
    try {
      const data = await visitsService.getPatientVisits(req.params.patientId);
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  [CONTROLLERS.GET_DOCTOR_VISITS]: async (req, res, next) => {
    try {
      const data = await visitsService.getDoctorVisits(req.params.doctorId);
      res.status(StatusCodes.OK).json({ success: true, data });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
};
