import dotenv from "dotenv";
import logger from "./common/utils/logger/index.js";
import {
  closeMongoConnection,
  startMongoConnection,
} from "./config/db/index.js";
import { port } from "./config/env/index.js";
import app from "./server/app.js";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const startServer = async () => {
  process.on("warning", (warning) =>
    logger.warn(
      `Warning: ${warning.name}: ${warning.message}\nStack Trace: ${warning.stack}`
    )
  );

  process.on("unhandledRejection", (reason, promise) => {
    logger.error(
      `Unhandled Rejection at: ${JSON.stringify(promise)}, reason: ${reason}, Stack Trace: ${reason.stack}`
    );
  });

  await startMongoConnection();

  const server = app.listen(port, () => {
    logger.info(`Server is running and listening on port ${port}`);
  });

  process.on("SIGTERM", () => {
    logger.info("Received SIGTERM, shutting down gracefully...");
    server.close(() => {
      closeMongoConnection();
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    logger.info("Received SIGINT, shutting down immediately...");
    server.close(() => {
      closeMongoConnection();
      process.exit(0);
    });
  });
};

startServer();
