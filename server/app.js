import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { ErrorHandler } from "../common/middleware/errorHandler/index.js";
import requestLogger from "../common/middleware/requestLogger/index.js";
import { API_BASE_PATH } from "../config/env/index.js";
import router from "./router.js";

const corsOptions = {
  origin: "*",
  maxAge: 3600,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
};
const helmetOptions = {
  crossOriginResourcePolicy: { policy: "cross-origin" },
};

const handlePreflight = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(204).end();
};

const app = express();

app.use(helmet(helmetOptions));
app.use(compression());
app.use(requestLogger);
app.use(cors(corsOptions));
app.options("*", handlePreflight);
app.use(bodyParser.json({ limit: "10mb" }));
app.use(`${API_BASE_PATH}`, router);
app.use(ErrorHandler());

export default app;
