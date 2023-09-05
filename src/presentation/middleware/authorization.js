import ProductManager from "../../domain/managers/productManager.js";

const authorization = (permission) => {
  return async (req, res, next) => {
    const user = req.user;
    const productId = req.params.productId;
    if (productId) {
      if (permission === "deleteProduct" || "updateProduct") {

        if (user.isAdmin) {
          return next(); 
        }

        const manager = new ProductManager();
        const product = await manager.findById(productId);


        if (user.role.name === "premium" && product.owner === user.email) {
          return next();
        }

        return res.status(401).send({ message: "You are not authorized to see this. Please, contact supervisor." });
      }
    }

    if (!user.isAdmin && !user.role.permissions.includes(permission)) {
      return res.status(401).send({ message: "You are not authorized to see this. Please, contact supervisor." });
    }

    next();
  };
};

export default authorization;
