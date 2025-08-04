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

//TODO adding approving workflow use Pending

export const VISIT_STATUS = {
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const VISIT_DURATION_MINUTES = 60;
export const visitsErrors = Object.freeze({
  DOCTOR_HAS_ALREADY_ACTIVE_VISIT: {
    message: (day, time) => `Doctor is not available on ${day} at ${time}`,
    code: 301,
  },
  VISIT_NOT_FOUND: {
    message: "Visit not found",
    code: 302,
  },
  DOCTOR_HAS_ACTIVE_VISIT: {
    message: "Doctor has an active visit",
    code: 303,
  },
  DOCTOR_TIME_SLOT_TAKEN: {
    message: (scheduledTime, dayOfWeek, busySlots) =>
      `Doctor is already booked at ${scheduledTime} on ${dayOfWeek}. Busy slots: ${busySlots.join(", ")}`,
    code: 305,
  },
  UNAUTHORIZED_VISIT_ACCESS: {
    message: "Unauthorized access to visit",
    code: 306,
  },
  VISIT_CANNOT_BE_STARTED: {
    message: "Visit cannot be started",
    code: 307,
  },
  DOCTOR_HAS_ACTIVE_VISIT: {
    message: "Doctor has an active visit",
    code: 308,
  },
});
