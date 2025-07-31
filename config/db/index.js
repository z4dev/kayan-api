import mongoose from "mongoose";
import logger from "../../common/utils/logger/index.js";
import { mongoDBConfigs } from "../env/index.js";

export async function startMongoConnection() {
  const connectionUrl = mongoDBConfigs.mongoURL;
  const mongooseConnectionOptions = {
    connectTimeoutMS: 360000,
    socketTimeoutMS: 360000,
  };
  try {
    await mongoose.connect(connectionUrl, mongooseConnectionOptions);
    logger.info(
      `[startMongoConnection] Connected successfully to MongoDB server at ${connectionUrl}`
    );
  } catch (error) {
    logger.error(
      `[startMongoConnection] Connecting to MongoDB server at ${connectionUrl} error ${error.message} `
    );
    throw error;
  }
}

export async function closeMongoConnection() {
  try {
    await mongoose.connection.close();
    logger.info(
      "[closeMongoConnection] Disconnected successfully from MongoDB server"
    );
  } catch (error) {
    logger.error(
      `[closeMongoConnection] Disconnecting from MongoDB server error ${error.message} `
    );
    throw error;
  }
}
