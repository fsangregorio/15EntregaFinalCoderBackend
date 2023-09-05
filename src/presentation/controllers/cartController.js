
import OrderManager from "../../domain/managers/orderManager.js";
import CartManager from "../../domain/managers/cartManager.js";
import ProductManager from '../../domain/managers/productManager.js';

import { decodeToken } from "../../common/jwt.js";

export const getCartById = async (req, res, next) => {
  try {
    const manager = new CartManager();
    const cart = await manager.getCartWithProducts(req.params.cartId);
    return res.status(201).json({ status: "Success", payload: cart });
  } catch (error) {
    next(error);
  }
};

export const createCart = async (req, res, next) => {
  try {
    const manager = new CartManager();
    const cart = await manager.create();
    return res.status(201).json({ status: "Success", payload: cart });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { user } = req;
    const productManager = new ProductManager();
    const product = await productManager.findById(req.params.productId);

    if (user.email === product.owner) throw new Error("Error");
    const manager = new CartManager();
    const cart = await manager.addProduct(req.params.cartId, req.params.productId);

    return res.status(201).json({ status: "Success", payload: cart });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const manager = new CartManager();
    const cart = await manager.deleteProduct(
      req.params.cartId,
      req.params.productId
    );

    return res.status(201).json({ status: "Success", payload: cart });
  } catch (error) {
    next(error);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const manager = new CartManager();
    const cart = await manager.updateCart(req.params.cartId, req.body.products);
    return res.status(201).json({ status: "Success", payload: cart });
  } catch (error) {
    next(error);
  }
};

export const updateProductQuantity = async (req, res, next) => {
  try {
    const manager = new CartManager();
    const cart = await manager.updateProductQuantity(
      req.params.cartId,
      req.params.productId,
      req.body.quantity
    );
    return res.status(201).json({ status: "Success", payload: cart });
  } catch (error) {
    next(error);
  }
};

export const emptyCart = async (req, res, next) => {
  try {
    const manager = new CartManager();
    const cart = await manager.emptyCart(req.params.cartId);
    return res.status(201).json({ status: "Success", payload: cart });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).send({ status: "Error", message: "You are not authorized to access" });
    }
    const decodedToken = await decodeToken(accessToken);
    const userData = decodedToken.user;

    const cartManager = new CartManager();
    const cart = await cartManager.getCartWithProducts(req.params.cartId);

    if (userData.cart._id !== req.params.cartId) {
      return res
        .status(401)
        .send({ status: "error", message: "You are not authorized to access" });
    }
    const orderManager = new OrderManager();
    const order = await orderManager.createOrder(userData, cart);
    return res.status(201).json({ status: "Success", payload: order });
  } catch (err) {
    next(err);
  }
};
