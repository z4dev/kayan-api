import Joi from "joi";
import { CONTROLLERS, GENDERS } from "../helpers/constant.js";

export default {
    
  [CONTROLLERS.LIST_USERS]: {
    query: Joi.object({
      page: Joi.number().optional(),
      limit: Joi.number().optional(),
    }).optional(),
  },

  [CONTROLLERS.GET_USER]: {
    params: Joi.object({
      id: Joi.string().required(),
    }).required(),
  },

  [CONTROLLERS.REGISTER_PATIENT]: {
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      gender: Joi.string().valid(...Object.keys(GENDERS)).required(),
      dateOfBirth: Joi.date().required(),
      insuranceNumber: Joi.string().optional(),
      picture: Joi.string().optional(),
      phoneNumber: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      rePassword: Joi.string().required().valid(Joi.ref("password")),
      userType: Joi.forbidden().messages({
        "any.unknown": "You cannot specify userType manually.",
      }),
      isVerified: Joi.boolean().optional().default(false),
    }),
  },

  [CONTROLLERS.LOGIN]: {
    body: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
      rememberMe: Joi.boolean().optional().default(false),
    }),
  },

  [CONTROLLERS.LIST_DOCTORS]: {
    query: Joi.object().optional(),
  },

  [CONTROLLERS.GET_DOCTOR]: {
    params: Joi.object({
      id: Joi.string().required(),
    }).required(),
  },

  [CONTROLLERS.LIST_PATIENTS]: {
    query: Joi.object().optional(),
  },

  [CONTROLLERS.GET_PATIENT]: {
    params: Joi.object({
      id: Joi.string().required(),
    }).required(),
  },
};
