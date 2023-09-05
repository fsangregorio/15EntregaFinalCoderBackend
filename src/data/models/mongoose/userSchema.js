
import mongoosePaginate from "mongoose-paginate-v2";
import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  age: { type: Number, default: 18 },
  isAdmin: { type: Boolean, default: false },
  role: { type: Schema.Types.ObjectId, index: true, ref: "Role" },
  cart: { type: Schema.Types.ObjectId, ref: "Cart" },
  orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
  documents: [{ name: String, reference: String }],
  status: { type: Boolean, default: true },
  lastConnection: { type: Date },
});

UserSchema.plugin(mongoosePaginate);

UserSchema.pre(["find", "findOne"], function () {
  this.populate(["role"]);
});

UserSchema.pre(["find", "findOne"], function () {
  this.populate(["cart"]);
});

const userSchema = model("User", UserSchema);

export default userSchema;
