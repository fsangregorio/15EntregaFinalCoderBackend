
import dotenv from "dotenv";
dotenv.config();
import { createContainer, asClass, Lifetime } from "awilix";
import UserMongooseRepository from "./data/repositories/mongoose/userMongooseRepository.js";
import RoleMongooseRepository from "./data/repositories/mongoose/roleMongooseRepository.js";
import ProductMongooseRepository from "./data/repositories/mongoose/productMongooseRepository.js";
import CartMongooseRepository from "./data/repositories/mongoose/cartMongooseRepository.js";
import OrderMongooseRepository from "./data/repositories/mongoose/orderMongooseRepository.js";

const container = createContainer();

if (process.env.DB === "MongooseAdapter") {
  container.register({
    UserRepository: asClass(UserMongooseRepository).scoped(Lifetime.SINGLETON),
    RoleRepository: asClass(RoleMongooseRepository).scoped(Lifetime.SINGLETON),
    ProductRepository: asClass(ProductMongooseRepository).scoped(
      Lifetime.SINGLETON
    ),
    CartRepository: asClass(CartMongooseRepository).scoped(Lifetime.SINGLETON),
    OrderRepository: asClass(OrderMongooseRepository).scoped(
      Lifetime.SINGLETON
    ),
  });
} else if (process.env.DB === "file") {
}
export default container;
