
import { Router } from "express";
import {createCart, getCartById, addToCart, deleteProduct, updateCart, updateProductQuantity, emptyCart,
  createOrder,
} from "../controllers/cartController.js";
import authenticate from "../../presentation/middleware/auth.js";

const cartRouter = Router();

cartRouter.get("/", createCart);
cartRouter.get("/:cartId", getCartById);
cartRouter.post("/:cartId/proudct/:productId/", authenticate, addToCart);
cartRouter.post("/:cartId/purchase", authenticate, createOrder);
cartRouter.delete("/:cartId/proudct/:productId/", deleteProduct);
cartRouter.put("/:cartId", updateCart);
cartRouter.put("/:cartId/proudct/:productId/", updateProductQuantity);
cartRouter.delete("/:cartId", emptyCart);

export default cartRouter;
