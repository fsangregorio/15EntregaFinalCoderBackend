
import orderSchema from "../../models/mongoose/orderSchema.js";
import Order from "../../../domain/entities/order.js";

export default class OrderMongooseRepositoy {
  async createOrder(orderData) {
    const order = {
      purchaser: orderData.email,
      code: orderData.code,
      amount: orderData.amount,
      createdAt: new Date(),
    };

    const orderDocument = await orderSchema.create(order);
    return new Order({
      id: orderDocument._id,
      purchaser: orderDocument.purchaser,
      code: orderDocument.code,
      amount: orderDocument.amount,
      createdAt: orderDocument.createdAt,
      status: orderDocument.status,
      completedAt: orderDocument.completedAt,
    });
  }

  async getOrder(id) {
    const orderDocument = await orderSchema.findById(id);
    if (!orderDocument) throw { message: "Order not found" };
    return new Order({
      id: orderDocument._id,
      purchaser: orderDocument.purchaser,
      code: orderDocument.code,
      amount: orderDocument.amount,
      createdAt: orderDocument.createdAt,
      status: orderDocument.status,
      completedAt: orderDocument.completedAt,
    });
  }
  
  async updateOrder(id, orderData) {
    const orderDocument = await orderSchema.findByIdAndUpdate(id, orderData, { new: true });
    if (!orderDocument) throw { message: "Order not found" };
    return new Order({
      id: orderDocument._id,
      purchaser: orderDocument.purchaser,
      code: orderDocument.code,
      amount: orderDocument.amount,
      createdAt: orderDocument.createdAt,
      status: orderDocument.status,
      completedAt: orderDocument.completedAt,
    });
  }
}