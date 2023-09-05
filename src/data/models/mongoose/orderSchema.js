
import mongoosePaginate from "mongoose-paginate-v2";
import { Schema, model } from "mongoose";

const OrderSchema = new Schema({
  purchaser: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' },
  completedAt: { type: Date },
});

OrderSchema.plugin(mongoosePaginate);

const orderSchema = model("Order", OrderSchema);

export default orderSchema;
