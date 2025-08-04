import Joi from "joi";
import { CONTROLLERS, VISIT_STATUS } from "../helpers/constant.js";

export default {
  [CONTROLLERS.CREATE_VISIT]: {
    body: Joi.object({
      doctorId: Joi.string().required(),
      scheduledDate: Joi.date().iso().required(),
      scheduledTime: Joi.string()
        .pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
        .required(),
      notes: Joi.string().allow("").optional(),
      patientId: Joi.forbidden(),
    }),
  },
  [CONTROLLERS.LIST_VISITS]: {
    query: Joi.object({
      page: Joi.number().integer().min(1).optional().default(1),
      limit: Joi.number().integer().min(1).max(100).optional().default(10),
      status: Joi.string()
        .valid(...Object.values(VISIT_STATUS))
        .optional(),
      doctorId: Joi.string().optional(),
      patientId: Joi.string().optional(),
    }),
  },

  [CONTROLLERS.GET_VISIT]: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  [CONTROLLERS.START_VISIT]: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      notes: Joi.string().optional().allow(""),
      patientId: Joi.string().forbidden(),
      doctorId: Joi.string().forbidden(),
      startedAt: Joi.date().iso().optional().default(new Date()),
    }),
  },

  [CONTROLLERS.END_VISIT]: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  [CONTROLLERS.ADD_TREATMENT]: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().optional().allow(""),
      cost: Joi.number().min(0).required(),
    }),
  },

  [CONTROLLERS.UPDATE_TREATMENT]: {
    params: Joi.object({
      visitId: Joi.string().required(),
      treatmentId: Joi.string().required(),
    }),
    body: Joi.object({
      name: Joi.string().optional(),
      description: Joi.string().optional().allow(""),
      cost: Joi.number().min(0).optional(),
    }).min(1),
  },

  [CONTROLLERS.REMOVE_TREATMENT]: {
    params: Joi.object({
      visitId: Joi.string().required(),
      treatmentId: Joi.string().required(),
    }),
  },

  [CONTROLLERS.UPDATE_VISIT_NOTES]: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      notes: Joi.string().required().allow(""),
    }),
  },

  [CONTROLLERS.SEARCH_VISITS]: {
    query: Joi.object({
      doctorName: Joi.string().optional(),
      patientName: Joi.string().optional(),
      visitId: Joi.string().optional(),
      page: Joi.number().integer().min(1).optional().default(1),
      limit: Joi.number().integer().min(1).max(100).optional().default(10),
    }).or("doctorName", "patientName", "visitId"),
  },

  [CONTROLLERS.GET_PATIENT_VISITS]: {
    params: Joi.object({
      patientId: Joi.string().required(),
    }),
  },

  [CONTROLLERS.GET_DOCTOR_VISITS]: {
    params: Joi.object({
      doctorId: Joi.string().required(),
    }),
  },
};
