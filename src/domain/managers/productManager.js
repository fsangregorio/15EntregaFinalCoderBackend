
import container from "../../container.js";
import idValidation from "../validations/common/idValidation.js";
import productUpdateValidation from "../validations/product/productUpdateValidation.js";
import productCreateValidation from "../validations/product/productCreateValidation.js";

class ProductManager {
  constructor() {
    this.productRepository = container.resolve("ProductRepository");
  }

  async find(params) {
    return await this.productRepository.find(params);
  }

  async findById(id) {
    await idValidation.parseAsync({ id });
    const product = await this.productRepository.findById(id);
    if (product == null) throw new Error("Product not found");
    return product;
  }

  async create(product) {
    await productCreateValidation.parseAsync(product);
    return await this.productRepository.createProduct(product);
  }

  async update(id, product) {
    await productUpdateValidation.parseAsync({ id, ...product });
    return await this.productRepository.updateProduct(id, product);
  }

  async delete(id) {
    await idValidation.parseAsync({ id });
    return await this.productRepository.deleteProduct(id);
  }
}

export default ProductManager;
