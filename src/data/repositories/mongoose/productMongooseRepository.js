
import Product from "../../../domain/entities/product.js";
import productSchema from "../../models/mongoose/productSchema.js";

export default class ProductMongooseRepository {
  async find({ limit, sort, category, status, page }) {
    let paginateQuery = {};
    if (category) {
      paginateQuery = { ...paginateQuery, category: category };
    }
    if (status) {
      paginateQuery = { ...paginateQuery, status: status };
    }
    let sortQuery;
    sort === "asc" ? (sortQuery = 1) : sort === "desc" ? (sortQuery = -1) : {};

    const paginateOptions = {
      page: page || 1,
      limit: limit || 10,
      sort: { price: sortQuery || -1 },
    };

    const productDocuments = await productSchema.paginate(
      paginateQuery,
      paginateOptions
    );

    const { docs, ...pagination } = productDocuments;
    const products = docs.map(
      (document) =>
        new Product({
          id: document._id,
          code: document.code,
          title: document.title,
          description: document.description,
          price: document.price,
          status: document.status,
          stock: document.stock,
          category: document.category,
          thumbnail: document.thumbnail,
          owner: document.owner,
        })
    );

    return { products, pagination };
  }

  async findById(productId) {
    const productDocument = await productSchema.findById(productId);
    if (!productDocument) throw {message: "Product not found"};

    return new Product({
      id: productDocument._id,
      code: productDocument.code,
      title: productDocument.title,
      description: productDocument.description,
      price: productDocument.price,
      status: productDocument.status,
      stock: productDocument.stock,
      category: productDocument.category,
      thumbnail: productDocument.thumbnail,
      owner: productDocument.owner,
    });
  }
  async createProduct(product) {
    const sameCode = await productSchema.findOne({ code: product.code });
    if (sameCode) {
      throw {
        message: "Product code already exists",
      };
    }
    const productDocument = new productSchema(product);
    await productDocument.save();

    return new Product({
      id: productDocument._id,
      code: productDocument.code,
      title: productDocument.title,
      description: productDocument.description,
      price: productDocument.price,
      status: productDocument.status,
      stock: productDocument.stock,
      category: productDocument.category,
      thumbnail: productDocument.thumbnail,
      owner: productDocument.owner,
    });
  }
  async updateProduct(productId, product) {
    const options = { new: true };
    const productDocument = await productSchema.findByIdAndUpdate(
      productId,
      product,
      options
    );
    
    return new Product({
      id: productDocument._id,
      code: productDocument.code,
      title: productDocument.title,
      description: productDocument.description,
      price: productDocument.price,
      status: productDocument.status,
      stock: productDocument.stock,
      category: productDocument.category,
      thumbnail: productDocument.thumbnail,
      owner: productDocument.owner,
    });
  }
  async deleteProduct(productId) {
    const productDocument = await productSchema.findByIdAndDelete(productId);
    if (!productDocument) {
      throw { message: "Product not found" };
    }
    return new Product({
      id: productDocument._id,
      code: productDocument.code,
      title: productDocument.title,
      owner: productDocument.owner,
    });
  }
}
