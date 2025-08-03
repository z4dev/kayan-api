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
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const visitsErrors = Object.freeze({
  DOCTOR_HAS_ALREADY_ACTIVE_VISIT: {
    message: "Doctor has already an active visit",
    code: 201,
  },
});
