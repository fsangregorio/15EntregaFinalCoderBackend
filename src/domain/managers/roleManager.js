
import container from "../../container.js";
import idValidation from "../validations/common/idValidation.js";
import roleUpdateValidation from "../validations/role/roleUpdateValidation.js";
import roleCreateValidation from "../validations/role/roleCreateValidation.js";


class RoleManager {
  constructor() {
    this.roleRepository = container.resolve("RoleRepository");
  }

  async getRoles(params) {
    return await this.roleRepository.getRoles(params);
  }

  async getRoleById(roleId) {
    await idValidation.parseAsync({ id: roleId });
    return await this.roleRepository.getRoleById(roleId);
  }

  async getRoleByName(roleName) {
    return await this.roleRepository.getRoleByName(roleName);
  }

  async createRole(role) {
    await roleCreateValidation.parseAsync(role);
    const newRole = await this.roleRepository.createRole(role);
    return newRole;
  }

  async updateRole(roleId, role) {
    await roleUpdateValidation.parseAsync({ id: roleId, ...role });
    return await this.roleRepository.updateRole(roleId, role);
  }

  async deleteRole(roleId) {
    await idValidation.parseAsync({ id: roleId });
    return await this.roleRepository.deleteRole(roleId);
  }
}
export default RoleManager;

