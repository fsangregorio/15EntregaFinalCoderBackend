
import { logger } from "../../config/loggerconfig.js";

const errorHandler = (err, req, res, next) => {  
  if (err?.message?.includes("Not found")) {
    console.log(err.stack);
    return res.status(404).json({ message: err.message });
  }
  else if (err?.name?.includes("ZodError")) {
    console.log(err.stack);
    return res.status(400).json({ message: err.issues });
  }
  else if (err?.message?.includes("Exists")) {
    console.log(err.stack);
    return res.status(409).json({ message: err.message });
  }
  else if (err?.message?.includes("Incorrect Password")) {
    console.log(err.stack);
    return res.status(400).json({ message: err.message });
  }
  else if (err?.message?.includes("Order failed")) {
    console.log(err.stack);
    return res
      .status(400)
      .json({ message: err.message, noStockProducts: err.noStockProducts });
  }

  logger.error(err.stack);
  return res.status(500).json({ message: err.message });
  
};

export default errorHandler;
  