
import { Router } from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser, setPremiumUser, uploadDocuments,
} from "../controllers/userController.js";
import authenticate from "../middleware/auth.js";
import authorization from "../middleware/authorization.js";
import upload from '../middleware/upload.js';

const userRouter = Router();

userRouter.use(authenticate);

userRouter.get("/", authorization("getUsers"), getUsers);
userRouter.get("/:id", authorization("getUser"), getUserById);
userRouter.post("/", authorization("saveUser"), createUser);
userRouter.post(
  '/:id/documents',
  upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'document', maxCount: 1 },
  ]),
  uploadDocuments,
);
userRouter.put("/:id", authorization("updateUser"), updateUser);
userRouter.put('/premium/:id', authorization('updateUser'), setPremiumUser);
userRouter.delete("/:id", authorization("deleteUser"), deleteUser);

export default userRouter;
