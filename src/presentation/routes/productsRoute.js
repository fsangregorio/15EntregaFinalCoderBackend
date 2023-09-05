
import { Router } from "express";
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct,
} from "../controllers/productController.js";
import authorization from "../middleware/authorization.js";
import authenticate from "../middleware/auth.js";

const productRouter = Router();

productRouter.get("/", getProducts);
productRouter.get("/:productId", getProductById);
productRouter.post(
  "/",
  authenticate,
  authorization("createProduct"),
  createProduct
);
productRouter.put(
  "/:productId",
  authenticate,
  authorization("updateProduct"),
  updateProduct
);
productRouter.delete(
  "/:productId",
  authenticate,
  authorization("deleteProduct"),
  deleteProduct
);

export default productRouter;
