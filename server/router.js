import express from "express";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.use("/health", (req, res) => {
  const data = {
    uptime: process.uptime(),
    date: new Date(),
  };

  res.status(StatusCodes.OK).send(data);
});

export default router;
