import moment from "moment";
import winston from "winston";

const { format } = winston;
const { combine, timestamp, printf } = format;

/**
 * Define custom log format
 * @param {String} level
 * @param {String} message
 * @param {String} serviceName
 * @param {String} functionName
 * @param {Date()} timestamp
 * @returns formatted log
 */
const customFormat = printf(({ level, message, serviceName, timestamp }) => {
  const formattedDate = moment(timestamp).format("YYYY-MM-DD, hh:mm:ssA");

  let color;
  switch (level) {
    case "info":
      color = "\x1b[0m"; // default color
      break;
    case "warn":
      color = "\x1b[33m"; // yellow
      break;
    case "error":
      color = "\x1b[31m"; // red
      break;
    default:
      color = "\x1b[0m"; // default color
  }
  return `=> ${color}[${level.toUpperCase()}] [${serviceName}] [${formattedDate}] [${message}\x1b[0m]`;
});

// Create Winston logger instance
const logger = winston.createLogger({
  format: combine(timestamp(), customFormat),
  transports: [new winston.transports.Console()],
});

const getCallerInfo = () => {
  const stackTrace = new Error().stack.split("\n");
  const callerLine = stackTrace[3];
  const [, absolutePath, lineNumber, columnNumber] =
    /\((.*):(\d+):(\d+)\)/.exec(callerLine);
  const lineInfo = `${absolutePath}:${lineNumber}:${columnNumber}`;
  return { serviceName: lineInfo };
};

logger.info = (message) => {
  const { serviceName } = getCallerInfo();
  logger.log({
    level: "info",
    serviceName,
    message,
  });
};

logger.warn = (message) => {
  const { serviceName } = getCallerInfo();
  logger.log({
    level: "warn",
    serviceName,
    message,
  });
};

logger.error = (message) => {
  const { serviceName } = getCallerInfo();
  logger.log({
    level: "error",
    serviceName,
    message,
  });
};

export default logger;
