export const CONTROLLERS = {
  LOGIN: "login",
  REGISTER_PATIENT: "REGISTER_PATIENT",
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
});
