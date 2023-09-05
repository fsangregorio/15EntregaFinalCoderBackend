
import { Router } from "express";
import testLogger from "../controllers/testLoggerController.js";

const testLoggerRouter = Router();

testLoggerRouter.get("/", testLogger);

export default testLoggerRouter;
