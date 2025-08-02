export const CONTROLLERS = {
  CREATE_VISIT: "createVisit",
  LIST_VISITS: "listVisits",
  GET_VISIT: "getVisit",
  START_VISIT: "startVisit",
  END_VISIT: "endVisit",
  ADD_TREATMENT: "addTreatment",
  UPDATE_TREATMENT: "updateTreatment",
  REMOVE_TREATMENT: "removeTreatment",
  UPDATE_VISIT_NOTES: "updateVisitNotes",
  SEARCH_VISITS: "searchVisits",
  GET_DOCTOR_ACTIVE_VISIT: "getDoctorActiveVisit",
  GET_PATIENT_VISITS: "getPatientVisits",
  GET_DOCTOR_VISITS: "getDoctorVisits",
};

export const VISIT_STATUS = {
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const visitsErrors = Object.freeze({
  VISIT_NOT_FOUND: {
    code: 201,
    message: "Visit not found",
  },
  PATIENT_NOT_FOUND: {
    code: 202,
    message: "Patient not found",
  },
  DOCTOR_NOT_FOUND: {
    code: 203,
    message: "Doctor not found",
  },
  DOCTOR_HAS_ACTIVE_VISIT: {
    code: 204,
    message: "Doctor already has an active visit",
  },
  UNAUTHORIZED_VISIT_ACCESS: {
    code: 205,
    message: "Unauthorized access to this visit",
  },
  VISIT_CANNOT_BE_STARTED: {
    code: 206,
    message: "Visit cannot be started. It must be in scheduled status",
  },
  VISIT_CANNOT_BE_ENDED: {
    code: 207,
    message: "Visit cannot be ended. It must be in progress",
  },
  VISIT_NOT_IN_PROGRESS: {
    code: 208,
    message: "Visit is not in progress",
  },
  TREATMENT_NOT_FOUND: {
    code: 209,
    message: "Treatment not found",
  },
  INVALID_VISIT_STATUS: {
    code: 210,
    message: "Invalid visit status",
  },
});
