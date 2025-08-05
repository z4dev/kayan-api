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

router.get(
  "/search",
  Authenticate,
  Authorization.Authorize(permission[CONTROLLERS.SEARCH_VISITS]),
  validateRequest(validationSchemas[CONTROLLERS.SEARCH_VISITS]),
  Controller[CONTROLLERS.SEARCH_VISITS]
);

router.put(
  "/:id/start",
  Authenticate,
  Authorization.Authorize(permission[CONTROLLERS.START_VISIT]),
  validateRequest(validationSchemas[CONTROLLERS.START_VISIT]),
  Controller[CONTROLLERS.START_VISIT]
);

router.post(
  "/",
  Authenticate,
  Authorization.Authorize(permission[CONTROLLERS.CREATE_VISIT]),
  validateRequest(validationSchemas[CONTROLLERS.CREATE_VISIT]),
  Controller[CONTROLLERS.CREATE_VISIT]
);

router.get(
  "/:id",
  Authenticate,
  Authorization.Authorize(permission[CONTROLLERS.GET_VISIT]),
  validateRequest(validationSchemas[CONTROLLERS.GET_VISIT]),
  Controller[CONTROLLERS.GET_VISIT]
);

router.put(
  "/:id/end",
  Authenticate,
  Authorization.Authorize(permission[CONTROLLERS.END_VISIT]),
  validateRequest(validationSchemas[CONTROLLERS.END_VISIT]),
  Controller[CONTROLLERS.END_VISIT]
);


router.put(
  "/:id/notes",
  Authenticate,
  Authorization.Authorize(permission[CONTROLLERS.UPDATE_VISIT_NOTES]),
  validateRequest(validationSchemas[CONTROLLERS.UPDATE_VISIT_NOTES]),
  Controller[CONTROLLERS.UPDATE_VISIT_NOTES]
);


router.post(
  "/:id/treatments",
  Authenticate,
  Authorization.Authorize(permission[CONTROLLERS.ADD_TREATMENT]),
  validateRequest(validationSchemas[CONTROLLERS.ADD_TREATMENT]),
  Controller[CONTROLLERS.ADD_TREATMENT]
);


router.put(
  "/:visitId/treatments/:treatmentId",
  Authenticate,
  Authorization.Authorize(permission[CONTROLLERS.UPDATE_TREATMENT]),
  validateRequest(validationSchemas[CONTROLLERS.UPDATE_TREATMENT]),
  Controller[CONTROLLERS.UPDATE_TREATMENT]
);


router.delete(
  "/:visitId/treatments/:treatmentId",
  Authenticate,
  Authorization.Authorize(permission[CONTROLLERS.REMOVE_TREATMENT]),
  validateRequest(validationSchemas[CONTROLLERS.REMOVE_TREATMENT]),
  Controller[CONTROLLERS.REMOVE_TREATMENT]
);

export default router;
