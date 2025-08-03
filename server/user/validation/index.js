import Joi from "joi";
import { USER_ROLES } from "../../../common/helpers/constant.js";
import {
  CONTROLLERS,
  DAYS_OF_WEEK,
  GENDERS,
  MAX_CONSULTATION_FEE,
  NO_ADDRESS,
} from "../helpers/constant.js";

const availabilitySchema = Joi.array()
  .items(
    Joi.object({
      dayOfWeek: Joi.string()
        .valid(...DAYS_OF_WEEK)
        .required(),
      startTime: Joi.string()
        .pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
        .required(),
      endTime: Joi.string()
        .pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
        .required(),
    }).required()
  )
  .min(1)
  .required()
  .custom((value, helpers) => {
    const seenDays = new Set();

    for (const item of value) {
      if (seenDays.has(item.dayOfWeek)) {
        return helpers.error("any.invalid", {
          message: `Duplicate dayOfWeek: ${item.dayOfWeek}`,
        });
      }
      seenDays.add(item.dayOfWeek);

      const [startHour, startMin] = item.startTime.split(":").map(Number);
      const [endHour, endMin] = item.endTime.split(":").map(Number);

      const startTotal = startHour * 60 + startMin;
      const endTotal = endHour * 60 + endMin;

      if (startTotal >= endTotal) {
        return helpers.error("any.invalid", {
          message: `startTime (${item.startTime}) must be earlier than endTime (${item.endTime}) for ${item.dayOfWeek}`,
        });
      }
    }

    return value;
  });

const availabilityItemSchemaForUpdate = Joi.object({
  dayOfWeek: Joi.string()
    .valid(...DAYS_OF_WEEK)
    .optional(),
  startTime: Joi.string()
    .pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  endTime: Joi.string()
    .pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
}).or("dayOfWeek", "startTime", "endTime");

export const availabilitySchemaWhenUpdate = Joi.array()
  .items(availabilityItemSchemaForUpdate.required())
  .custom((value, helpers) => {
    if (!Array.isArray(value)) return value;

    const seenDays = new Set();

    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const { dayOfWeek, startTime, endTime } = item;

      // Check for duplicate days
      if (dayOfWeek) {
        if (seenDays.has(dayOfWeek)) {
          return helpers.message({
            custom: `availability[${i}].dayOfWeek: Duplicate dayOfWeek "${dayOfWeek}" is not allowed.`,
          });
        }
        seenDays.add(dayOfWeek);
      }
    }

    return value;
  })
  .optional();
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
  clinicAddress: Joi.string().default(NO_ADDRESS),
  licenseNumber: Joi.string().required(),
  consultationFee: Joi.number()
    .min(0)
    .max(MAX_CONSULTATION_FEE)
    .default(0)
    .required(),
  aboutDoctor: Joi.string().default("").required(),

  availability: availabilitySchema,
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
  consultationFee: Joi.number()
    .min(0)
    .max(MAX_CONSULTATION_FEE)
    .optional()
    .default(0),
  aboutDoctor: Joi.string().optional().default(""),
  availability: availabilitySchemaWhenUpdate,
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

  [CONTROLLERS.UPDATE_AVAILABILITY]: {
    body: Joi.object({
      availability: availabilitySchemaWhenUpdate,
    }).required(),
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
