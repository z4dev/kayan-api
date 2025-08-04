import express from "express";
import Authenticate from "../../../common/middleware/authentication/index.js";
import Authorization from "../../../common/middleware/authorization/index.js";
import validateRequest from "../../../common/middleware/requestValidation/index.js";
import Controller from "../controller/index.js";
import { CONTROLLERS } from "../helpers/constant.js";
import permission from "../permission.js";
import validationSchemas from "../validation/index.js";

const router = express.Router();

router.get(
  "/",
  Authenticate,
  validateRequest(validationSchemas[CONTROLLERS.LIST_VISITS]),
  Controller[CONTROLLERS.LIST_VISITS]
);

router.post(
  "/",
  Authenticate,
  validateRequest(validationSchemas[CONTROLLERS.CREATE_VISIT]),
  Controller[CONTROLLERS.CREATE_VISIT]
);

router.get(
  "/:id",
  Authenticate,
  validateRequest(validationSchemas[CONTROLLERS.GET_VISIT]),
  Controller[CONTROLLERS.GET_VISIT]
);

// Search visits (Finance)
router.get(
  "/search",
  Authorization.Authorize(permission[CONTROLLERS.SEARCH_VISITS]),
  Authenticate,
  validateRequest(validationSchemas[CONTROLLERS.SEARCH_VISITS]),
  Controller[CONTROLLERS.SEARCH_VISITS]
);

// Get doctor's active visit
router.get(
  "/doctor/active",
  Authenticate,
  Controller[CONTROLLERS.GET_DOCTOR_ACTIVE_VISIT]
);

// Get patient visits
router.get(
  "/patient/:patientId",
  Authenticate,
  validateRequest(validationSchemas[CONTROLLERS.GET_PATIENT_VISITS]),
  Controller[CONTROLLERS.GET_PATIENT_VISITS]
);

// Get doctor visits
router.get(
  "/doctor/:doctorId",
  Authenticate,
  validateRequest(validationSchemas[CONTROLLERS.GET_DOCTOR_VISITS]),
  Controller[CONTROLLERS.GET_DOCTOR_VISITS]
);

router.get(
  "/:id",
  Authenticate,
  validateRequest(validationSchemas[CONTROLLERS.GET_VISIT]),
  Controller[CONTROLLERS.GET_VISIT]
);

router.put(
  "/:id/start",
  Authenticate,
  validateRequest(validationSchemas[CONTROLLERS.START_VISIT]),
  Controller[CONTROLLERS.START_VISIT]
);

router.put(
  "/:id/end",
  Authenticate,
  validateRequest(validationSchemas[CONTROLLERS.END_VISIT]),
  Controller[CONTROLLERS.END_VISIT]
);

router.put(
  "/:id/notes",
  Authenticate,
  validateRequest(validationSchemas[CONTROLLERS.UPDATE_VISIT_NOTES]),
  Controller[CONTROLLERS.UPDATE_VISIT_NOTES]
);

router.post(
  "/:id/treatments",
  Authenticate,
  validateRequest(validationSchemas[CONTROLLERS.ADD_TREATMENT]),
  Controller[CONTROLLERS.ADD_TREATMENT]
);

router.put(
  "/:visitId/treatments/:treatmentId",
  Authenticate,
  validateRequest(validationSchemas[CONTROLLERS.UPDATE_TREATMENT]),
  Controller[CONTROLLERS.UPDATE_TREATMENT]
);

// Remove treatment (Doctor)
router.delete(
  "/:visitId/treatments/:treatmentId",
  Authenticate,
  validateRequest(validationSchemas[CONTROLLERS.REMOVE_TREATMENT]),
  Controller[CONTROLLERS.REMOVE_TREATMENT]
);

export default router;
