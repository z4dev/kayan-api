export const errorCodes = Object.freeze({
  USER_NOT_AUTHORIZED: {
    message: "User not authorized",
    code: 1,
  },
});

const PATIENT = "PATIENT";
const DOCTOR = "DOCTOR";
const FINANCE = "FINANCE";

export const USER_ROLES = {
  PATIENT,
  DOCTOR,
  FINANCE,
};
