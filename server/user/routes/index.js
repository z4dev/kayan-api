import express from "express";
import Authenticate from "../../../common/middleware/authentication/index.js";
import Authorization from "../../../common/middleware/authorization/index.js";
import validateRequest from "../../../common/middleware/requestValidation/index.js";
import Controller from "../controller/index.js";
import { CONTROLLERS } from "../helpers/constant.js";
import permission from "../permission.js";
import validationSchemas from "../validation/index.js";

const router = express.Router();

router.post(
  "/patient/register",
  validateRequest(validationSchemas[CONTROLLERS.REGISTER_PATIENT]),
  Controller[CONTROLLERS.REGISTER_PATIENT]
);
router.post(
  "/doctor/register",
  validateRequest(validationSchemas[CONTROLLERS.REGISTER_DOCTOR]),
  Controller[CONTROLLERS.REGISTER_DOCTOR]
);
router.post(
  "/finance/register",
  validateRequest(validationSchemas[CONTROLLERS.REGISTER_FINANCE]),
  Controller[CONTROLLERS.REGISTER_FINANCE]
);

router.post(
  "/login",
  validateRequest(validationSchemas[CONTROLLERS.LOGIN]),
  Controller[CONTROLLERS.LOGIN]
);

router.get(
  "/profile",
  Authenticate,
  Authorization.Authorize(permission[CONTROLLERS.GET_PROFILE]),
  validateRequest(validationSchemas[CONTROLLERS.GET_PROFILE]),
  Controller[CONTROLLERS.GET_PROFILE]
);

router.put(
  "/profile",
  Authenticate,
  Authorization.Authorize(permission[CONTROLLERS.UPDATE_PROFILE]),
  validateRequest(validationSchemas[CONTROLLERS.UPDATE_PROFILE]),
  Controller[CONTROLLERS.UPDATE_PROFILE]
);

router.get(
  "/doctors",
  Authenticate,
  Authorization.Authorize(permission[CONTROLLERS.LIST_DOCTORS]),
  validateRequest(validationSchemas[CONTROLLERS.LIST_DOCTORS]),
  Controller[CONTROLLERS.LIST_DOCTORS]
);
router.get(
  "/patients",
  Authenticate,
  Authorization.Authorize(permission[CONTROLLERS.LIST_PATIENTS]),
  validateRequest(validationSchemas[CONTROLLERS.LIST_PATIENTS]),
  Controller[CONTROLLERS.LIST_PATIENTS]
);
router.get(
  "/doctors/:id",
  Authenticate,
  Authorization.Authorize(permission[CONTROLLERS.GET_DOCTOR]),
  validateRequest(validationSchemas[CONTROLLERS.GET_DOCTOR]),
  Controller[CONTROLLERS.GET_DOCTOR]
);

router.get(
  "/patients/:id",
  Authenticate,
  Authorization.Authorize(permission[CONTROLLERS.GET_PATIENT]),
  validateRequest(validationSchemas[CONTROLLERS.GET_PATIENT]),
  Controller[CONTROLLERS.GET_PATIENT]
);

export default router;
