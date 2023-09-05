
import roleSchema from "../../models/mongoose/roleSchema.js";
import Role from "../../../domain/entities/role.js";

export default class RoleMongooseRepository {
  async getRoles({ limit, sort, role, page }) {
    let paginateQuery = {};
    if (role) {
      paginateQuery = { role: role };
    }
    let sortQuery;
    sort === "asc" ? (sortQuery = 1) : sort === "desc" ? (sortQuery = -1) : {};
    const paginateOptions = {
      page: page || 1,
      limit: limit || 10,
      sort: { email: sortQuery || -1 },
    };

    const roleDocuments = await roleSchema.paginate(
      paginateQuery,
      paginateOptions
    );

    const { docs, ...pagination } = roleDocuments;

    const roles = docs.map((document) => {
      return new Role({
        id: document._id,
        name: document.name,
        permissions: document.permissions,
      });
    });
    
    return { roles, pagination };
  }

  async getRoleById(roleId) {
    const roleDocument = await roleSchema.findById(roleId);
    if (!roleDocument)
      throw {
        message: "Role not found",
      };

    return new Role(
      roleDocument._id,
      roleDocument.name,
      roleDocument.permissions
    );
  }

  async getRoleByName(roleName) {
    const roleDocument = await roleSchema.findOne({ name: roleName });
    if (!roleDocument)
      throw {
        message: "Role not found",
      };

      return new Role({
        id: roleDocument._id,
        name: roleDocument.name,
        permissions: roleDocument.permissions,
      });
  }

  async createRole(newRole) {
    const roleExist = await roleSchema.findOne({ name: newRole.name });
    if (roleExist)
      throw {
        message: "Role already exist",
      };

    const roleDocument = await roleSchema.create(newRole);

    return new Role({
      id: roleDocument._id,
      name: roleDocument.name,
      permissions: roleDocument.permissions,
    });
  }

  async updateRole(roleId, role) {
    const roleDocument = await roleSchema.findByIdAndUpdate(roleId, role, {
      new: true,
    });
    if (!roleDocument)
      throw {
        message: "Role not found",
      };

    return new Role({
      id: roleDocument._id,
      name: roleDocument.name,
      permissions: roleDocument.permissions,
    });
  }

  async deleteRole(roleId) {
    return await roleSchema.findByIdAndDelete(roleId);
  }
};
