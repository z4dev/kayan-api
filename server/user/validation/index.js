import Joi from "joi";
import { USER_ROLES } from "../../../common/helpers/constant.js";
import { CONTROLLERS, GENDERS, NO_ADDRESS } from "../helpers/constant.js";

const baseUserFields = {
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  picture: Joi.string().optional(),
  phoneNumber: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  rePassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": "Passwords do not match",
  }),
  userType: Joi.forbidden().messages({
    "any.unknown": "You cannot specify userType manually.",
  }),
  isVerified: Joi.boolean().optional().default(true),
};

// when create
const baseUserFieldsWhenUpdate = {
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  picture: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().optional(),
  rePassword: Joi.any()
    .valid(Joi.ref("password"))
    .when("password", {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    })
    .messages({ "any.only": "Passwords do not match" }),
  userType: Joi.string()
    .valid(...Object.values(USER_ROLES))
    .forbidden()
    .messages({
      "any.unknown": "Invalid userType.",
    }),
  isVerified: Joi.boolean().optional(),
};

const patientFields = {
  gender: Joi.string()
    .valid(...Object.keys(GENDERS))
    .optional(),
  dateOfBirth: Joi.date().iso().optional(),
  insuranceNumber: Joi.string().optional(),
};

const doctorFields = {
  specialty: Joi.string().required(),
  clinicAddress: Joi.string().required().default(NO_ADDRESS),
  licenseNumber: Joi.string().required(),
};

// when update
const patientFieldsWhenUpdate = {
  gender: Joi.string()
    .valid(...Object.keys(GENDERS))
    .optional(),
  dateOfBirth: Joi.date().iso().optional(),
  insuranceNumber: Joi.string().optional(),
};

const doctorFieldsWhenUpdate = {
  specialty: Joi.string().optional(),
  clinicAddress: Joi.string().optional().default(NO_ADDRESS),
  licenseNumber: Joi.string().optional(),
};

export default {
  [CONTROLLERS.LOGIN]: {
    body: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
      rememberMe: Joi.boolean().optional().default(false),
    }),
  },

  [CONTROLLERS.REGISTER_PATIENT]: {
    body: Joi.object({
      ...baseUserFields,
      ...patientFields,
    }),
  },

  [CONTROLLERS.REGISTER_DOCTOR]: {
    body: Joi.object({
      ...baseUserFields,
      ...doctorFields,
    }),
  },
  [CONTROLLERS.REGISTER_FINANCE]: {
    body: Joi.object({
      ...baseUserFields,
    }),
  },

  [CONTROLLERS.GET_PROFILE]: {
    params: Joi.object().optional(),
  },

  [CONTROLLERS.UPDATE_PROFILE]: {
    body: Joi.object({
      ...baseUserFieldsWhenUpdate,
    })
      .when(
        Joi.object({
          userType: Joi.valid(USER_ROLES.PATIENT).optional(),
        }).unknown(),
        {
          then: Joi.object(patientFieldsWhenUpdate),
        }
      )
      .when(
        Joi.object({
          userType: Joi.valid(USER_ROLES.DOCTOR).optional(),
        }).unknown(),
        {
          then: Joi.object(doctorFieldsWhenUpdate),
        }
      ),
  },

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
