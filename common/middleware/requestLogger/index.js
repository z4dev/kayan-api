import morgan from "morgan";
const customFormatFunction = (tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    `Query: ${JSON.stringify(req.query)}`,
    `Body: ${JSON.stringify(req.body)}`,
    `Authorization: ${req.headers.authorization || "No Authorization"}`,
    `${tokens["response-time"](req, res)} ms`,
  ].join(" | ");
};

const logger = morgan(customFormatFunction); // other predefined formats 'combined', 'tiny', 'short', 'dev'

export default logger;

