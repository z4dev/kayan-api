export const CONTROLLERS = {
  LOGIN: "login",
  REGISTER_PATIENT: "RegisterPatient",
  LIST_USERS: "listUsers",
  GET_USER: "getUser",
  LIST_DOCTORS: "listDoctors",
  LIST_PATIENTS: "listPatients",
  GET_DOCTOR: "getDoctor",
  GET_PATIENT: "getPatient",
};

export const GENDERS = {
  MALE: "MALE",
  FEMALE: "FEMALE",
};

export const usersErrors = Object.freeze({
  PATIENT_NOT_FOUND: {
    code: 101,
    message: "Patient not found",
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
});
