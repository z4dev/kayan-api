import express from "express";
import validateRequest from "../../../common/middleware/requestValidation/index.js";
import Controller from "../controller/index.js";
import { CONTROLLERS } from "../helpers/constant.js";
import validationSchemas from "../validation/index.js";

const router = express.Router();

router.post(
  "/register",
  validateRequest(validationSchemas[CONTROLLERS.REGISTER_PATIENT]),
  Controller[CONTROLLERS.REGISTER_PATIENT]
);

export default router;
