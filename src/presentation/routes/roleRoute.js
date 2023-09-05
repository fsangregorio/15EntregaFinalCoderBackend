import { Router } from "express";
import authenticate from "../middleware/auth.js";
import authorization from "../middleware/authorization.js";
import {getRoles, getRoleById, createRole, updateRole, deleteRole,
} from "../controllers/roleController.js";

const roleRouter = Router();

roleRouter.use(authenticate);

roleRouter.get("/", authorization("getRoles"), getRoles);
roleRouter.get("/:id", authorization("getRole"), getRoleById);
roleRouter.post("/", authorization("createRole"), createRole);
roleRouter.put("/:id", authorization("updateRole"), updateRole);
roleRouter.delete("/:id", authorization("deleteRole"), deleteRole);

export default roleRouter;
