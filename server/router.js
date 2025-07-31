import express from "express";
import { StatusCodes } from "http-status-codes";
import userRoutes from "./user/routes/index.js";

const router = express.Router();

// User routes
router.use("/users", userRoutes);

router.use("/health", (req, res) => {
  const data = {
    uptime: process.uptime(),
    date: new Date(),
  };

  res.status(StatusCodes.OK).send(data);
});

export default router;
