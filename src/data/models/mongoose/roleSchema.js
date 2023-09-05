
import mongoosePaginate from "mongoose-paginate-v2";
import { Schema, model } from "mongoose";

const RoleSchema = new Schema({
  name: { type: Schema.Types.String, required: true },
  permissions: [{ type: Schema.Types.String }],
});

RoleSchema.plugin(mongoosePaginate);

const roleSchema = model("Role", RoleSchema);

export default roleSchema;
