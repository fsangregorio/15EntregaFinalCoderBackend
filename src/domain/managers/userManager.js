
import { createHash } from "../../common/encrypt.js";
import container from "../../container.js";
import idValidation from "../validations/common/idValidation.js";
import userUpdateValidation from "../validations/user/userUpdateValidation.js";
import userCreateValidation from "../validations/user/userCreateValidation.js";

class UserManager {
  constructor() {
    this.userRepository = container.resolve("UserRepository");
    this.roleRepository = container.resolve("RoleRepository");
  }

  async getUsers(params) {
    return await this.userRepository.getUsers(params);
  }

  async getUserById(userId) {
    await idValidation.parseAsync({ id: userId });
    return await this.userRepository.getUserById(userId);
  }

  async getUserByEmail(email) {
    return await this.userRepository.getUserByEmail(email);
  }

  async createUser(user) {
    await userCreateValidation.parseAsync(user);
    const encryptedPassword = await createHash(user.password);
    user.password = encryptedPassword;
    const newUser = await this.userRepository.createUser(user);
    return { ...newUser, password: undefined };
  }

  async updateUser(userId, user) {
    await userUpdateValidation.parseAsync({ ...user, id: userId });
    const userUpdated = await this.userRepository.updateUser(userId, user);

    if (userUpdated == null)
      throw {
        message: "User not found",
      };
    return userUpdated;
  }

  async deleteUser(userId) {
    await idValidation.parseAsync({ id: userId });
    const deletedUser = await this.userRepository.deleteUser(userId);
    if (deletedUser == null)
      throw {
        message: "User not found",
      };
    return deletedUser;
  }

  async softDeleteInactiveUsers() {
    try {
      const { users } = await this.userRepository.getUsers({ paginate: false });
      const now = new Date();
      const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000;
      const inactiveUsers = [];
      users.forEach((user) => {
        if (!user.isAdmin) {
          const lastConnectionTime =
            user.lastConnection instanceof Date ? user.lastConnection.getTime() : 0;
          if (now.getTime() - lastConnectionTime > twoDaysInMillis && user.status !== false) {
            inactiveUsers.push({ id: user.id });
          }
        }
      });
      const softDeleteUser = await this.userRepository.softDeleteInactiveUsers(inactiveUsers);
      return softDeleteUser;
    } catch (error) {
      throw new Error(`Error`);
    }
  }

  async setPremiumUser(userId) {
    try {
      await idValidation.parseAsync({ id: userId });

      const [premiumRole, clientRole] = await Promise.all([
        this.roleRepository.getRoleByName("premium"),
        this.roleRepository.getRoleByName("client"),
      ]);

      if (!premiumRole || !clientRole) {
        throw new Error("Roles not found"); 
      }

      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      let newRoleId;
      const documents = user.documents;
      const hasProfileAndDocument =
        documents.some((item) => item.name === "profile") &&
        documents.some((item) => item.name === "document");
      if (user.role.name === clientRole.name) {
        if (!hasProfileAndDocument) {
          throw new Error("Error");
        }
        newRoleId = premiumRole.id;
      } else {
        newRoleId = clientRole.id;
      }
      const userUpdated = await this.userRepository.updateUser(userId, { role: newRoleId });
      return userUpdated;
    } catch (error) {
      throw new Error("Error");
    }
  }
}
export default UserManager;
