
import container from "../../container.js";

class CartManager {
  constructor() {
    this.cartRepository = container.resolve("CartRepository");
  }

  async findById(cartId) {
    return await this.cartRepository.findById(cartId);
  }

  async getCartWithProducts(cartId) {
    return await this.cartRepository.getCartWithProducts(cartId);
  }

  async create() {
    return await this.cartRepository.createCart();
  }

  async addProduct(cartId, productId) {
    return await this.cartRepository.addProduct(cartId, productId);
  }

  async deleteProduct(cartId, productId) {
    return await this.cartRepository.deleteProduct(cartId, productId);
  }

  async updateCart(cartId, products) {
    return await this.cartRepository.updateCart(cartId, products);
  }

  async updateProductQuantity(cartId, products, quantity) {
    return await this.cartRepository.updateProductQuantity(
      cartId,
      products,
      quantity
    );
  }

  async emptyCart(cartId) {
    return await this.cartRepository.emptyCart(cartId);
  }
}

export default CartManager;
