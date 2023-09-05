
import { Router } from "express";
import { login, logout, signup, current, forgotPassword, changePassword,
} from "../../presentation/controllers/sessionController.js";
import authenticate from "../../presentation/middleware/auth.js";

const sessionRouter = Router();

sessionRouter.post("/login", login);
sessionRouter.get("/current", authenticate, current);
sessionRouter.post("/signup", signup);
sessionRouter.post("/logout", logout);
sessionRouter.post("/forgot-password", forgotPassword);
sessionRouter.post("/change-password", changePassword);

export default sessionRouter;
