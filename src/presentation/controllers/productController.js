
import ProductManager from "../../domain/managers/productManager.js";
import { decodeToken } from '../../common/jwt.js';

const getProducts = async (req, res, next) => {
  try {
    const manager = new ProductManager();
    const { products, pagination } = await manager.find(req.query);
    return res.status(200).json({
      status: "Success",
      payload: products,
      ...pagination,
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const manager = new ProductManager();
    const product = await manager.findById(productId);
    return res.status(200).json({ status: "Success", payload: product });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).send({ status: "Error", message: "You are not authorized to access" });
    }
    const decodedToken = await decodeToken(accessToken);
    const userData = decodedToken.user;

    const manager = new ProductManager();
    const newProduct = { ...req.body, owner: userData.email };
    const product = await manager.create(newProduct);
    return res.status(201).json({ status: "Success", payload: product });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const manager = new ProductManager();
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).send({ status: "Error", message: "You are not authorized to access" });
    }
    const { user } = await decodeToken(accessToken);
    const owner = user.isAdmin || user.role.name === 'admin' ? 'admin' : user.email;

    const product = await manager.update(req.params.productId, {
      ...req.body,
      owner,
    });
    return res.status(201).json({ status: "Succeess", payload: product });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const manager = new ProductManager();
    const product = await manager.delete(req.params.productId);
    return res.status(201).json({ status: "Success", payload: product });
  } catch (error) {
    next(error);
  }
};

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
