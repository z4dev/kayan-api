export const CONTROLLERS = {
  LOGIN: "login",

  REGISTER_PATIENT: "RegisterPatient",
  REGISTER_DOCTOR: "RegisterDoctor",
  REGISTER_FINANCE: "RegisterFinance",

  LIST_DOCTORS: "listDoctors",
  LIST_PATIENTS: "listPatients",

  GET_PROFILE: "getPatientProfile",
  UPDATE_PROFILE: "updatePatientProfile",

  GET_DOCTOR: "getDoctor",
  GET_PATIENT: "getPatient",

  UPDATE_AVAILABILITY: "updateAvailability",
};

export const MAX_CONSULTATION_FEE = 50;

export const GENDERS = {
  MALE: "MALE",
  FEMALE: "FEMALE",
};

export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const NO_ADDRESS = "No Address Provided";

export const usersErrors = Object.freeze({
  PATIENT_NOT_FOUND: {
    code: 101,
    message: "Patient not found",
  },

  LICENSE_NUMBER_EXISTS: {
    code: 100,
    message: "License number already exists",
  },

  DOCTOR_NOT_FOUND: {
    code: 102,
    message: "Doctor not found",
  },

  INVALID_CREDENTIALS: {
    code: 103,
    message: "Invalid email or password",
  },
  INSURANCE_NUMBER_EXISTS: {
    code: 104,
    message: "Insurance number already exists",
  },
  EMAIL_OR_PHONE_EXISTS: {
    code: 105,
    message: "Email or phone number already exists",
  },
  USER_NOT_FOUND: {
    code: 106,
    message: "User not found",
  },

  INVALID_AVAILABILITY: {
    code: 107,
    message: "Invalid availability data",
  },
});
