
import { logger } from "../../config/loggerconfig.js";

const isProduction = process.env.NODE_ENV === "production";

const testLogger = (req, res, next) => {
  logger.info(`Information`);
  logger.warn(`Warning`);
  logger.error(`Error`);
  logger.fatal(`Fatal`);

  const message = isProduction
    ? "[Prod Mode] Check logger"
    : "[Dev Mode] Check console";

  return res.status(200).json({
    message: message,
  });
};

export default testLogger;
