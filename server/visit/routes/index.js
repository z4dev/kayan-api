import express from "express";
import authMiddleware from "../../../common/middleware/auth/index.js";
import validateRequest from "../../../common/middleware/requestValidation/index.js";
import Controller from "../controller/index.js";
import { CONTROLLERS } from "../helpers/constant.js";
import validationSchemas from "../validation/index.js";

const router = express.Router();

// Create visit (Patient can reserve)
router.post(
  "/",
  authMiddleware,
  validateRequest(validationSchemas[CONTROLLERS.CREATE_VISIT]),
  Controller[CONTROLLERS.CREATE_VISIT]
);

// List visits
router.get(
  "/",
  authMiddleware,
  validateRequest(validationSchemas[CONTROLLERS.LIST_VISITS]),
  Controller[CONTROLLERS.LIST_VISITS]
);

// Search visits (Finance)
router.get(
  "/search",
  authMiddleware,
  validateRequest(validationSchemas[CONTROLLERS.SEARCH_VISITS]),
  Controller[CONTROLLERS.SEARCH_VISITS]
);

// Get doctor's active visit
router.get(
  "/doctor/active",
  authMiddleware,
  Controller[CONTROLLERS.GET_DOCTOR_ACTIVE_VISIT]
);

// Get patient visits
router.get(
  "/patient/:patientId",
  authMiddleware,
  validateRequest(validationSchemas[CONTROLLERS.GET_PATIENT_VISITS]),
  Controller[CONTROLLERS.GET_PATIENT_VISITS]
);

// Get doctor visits
router.get(
  "/doctor/:doctorId",
  authMiddleware,
  validateRequest(validationSchemas[CONTROLLERS.GET_DOCTOR_VISITS]),
  Controller[CONTROLLERS.GET_DOCTOR_VISITS]
);

// Get specific visit
router.get(
  "/:id",
  authMiddleware,
  validateRequest(validationSchemas[CONTROLLERS.GET_VISIT]),
  Controller[CONTROLLERS.GET_VISIT]
);

// Start visit (Doctor)
router.patch(
  "/:id/start",
  authMiddleware,
  validateRequest(validationSchemas[CONTROLLERS.START_VISIT]),
  Controller[CONTROLLERS.START_VISIT]
);

// End visit (Doctor)
router.patch(
  "/:id/end",
  authMiddleware,
  validateRequest(validationSchemas[CONTROLLERS.END_VISIT]),
  Controller[CONTROLLERS.END_VISIT]
);

// Update visit notes (Doctor)
router.patch(
  "/:id/notes",
  authMiddleware,
  validateRequest(validationSchemas[CONTROLLERS.UPDATE_VISIT_NOTES]),
  Controller[CONTROLLERS.UPDATE_VISIT_NOTES]
);

// Add treatment (Doctor)
router.post(
  "/:id/treatments",
  authMiddleware,
  validateRequest(validationSchemas[CONTROLLERS.ADD_TREATMENT]),
  Controller[CONTROLLERS.ADD_TREATMENT]
);

// Update treatment (Doctor)
router.patch(
  "/:visitId/treatments/:treatmentId",
  authMiddleware,
  validateRequest(validationSchemas[CONTROLLERS.UPDATE_TREATMENT]),
  Controller[CONTROLLERS.UPDATE_TREATMENT]
);

// Remove treatment (Doctor)
router.delete(
  "/:visitId/treatments/:treatmentId",
  authMiddleware,
  validateRequest(validationSchemas[CONTROLLERS.REMOVE_TREATMENT]),
  Controller[CONTROLLERS.REMOVE_TREATMENT]
);

export default router;
