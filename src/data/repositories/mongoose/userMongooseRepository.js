
import roleSchema from "../../models/mongoose/roleSchema.js";
import cartSchema from "../../models/mongoose/cartSchema.js";
import userSchema from "../../models/mongoose/userSchema.js";
import User from "../../../domain/entities/user.js";

export default class UserMongooseRepository {
  async getUsers(options) {
    let { limit, sort, role, page, paginate } = options;
    if (paginate === undefined) {
      paginate = true;
    }

    let paginateQuery = {};
    if (role) {
      paginateQuery = { role: role };
    }
    let sortQuery;
    sort === 'asc' ? (sortQuery = 1) : sort === 'desc' ? (sortQuery = -1) : {};
    const paginateOptions = {
      page: page || 1,
      limit: limit || 10,
      sort: { email: sortQuery || -1 },
      pagination: paginate,
    };
    const userDocuments = await userSchema.paginate(paginateQuery, paginateOptions);

    const { docs, ...pagination } = userDocuments;
    const users = docs.map(
      (document) =>
        new User({
          id: document._id,
          firstName: document.firstName,
          lastName: document.lastName,
          email: document.email,
          isAdmin: document.isAdmin,
          role: document.role,
          cart: document.cart,
          documents: document.documents,
          status: document.status,
          lastConnection: document.lastConnection,
        }),
    );
    return {
      users,
      pagination,
    };
  }

  async getUserById(userId) {
    const userDocument = await userSchema.findById(userId);
    if (!userDocument)
      throw {
        message: "User not found",
      };
    return new User({
      id: userDocument._id,
      firstName: userDocument.firstName,
      lastName: userDocument.lastName,
      email: userDocument.email,
      isAdmin: userDocument.isAdmin,
      role: userDocument.role,
      cart: userDocument.cart,
      documents: userDocument.documents,
      status: userDocument.status,
      lastConnection: userDocument.lastConnection,
    });
  }

  async getUserByEmail(email) {
    const userDocument = await userSchema.findOne({ email });
    return new User({
      id: userDocument?._id,
      firstName: userDocument?.firstName,
      lastName: userDocument?.lastName,
      email: userDocument?.email,
      password: userDocument?.password,
      isAdmin: userDocument?.isAdmin,
      role: userDocument?.role,
      cart: userDocument?.cart,
      documents: userDocument.documents,
      status: userDocument.status,
      lastConnection: userDocument.lastConnection,
    });
  }

  async createUser(newUser) {
    const userExists = await userSchema.findOne({ email: newUser.email });
    if (userExists)
      throw {
        message: "User already exists",
      };

    const cartDocument = new cartSchema({
      products: [],
    });
    const newCart = await cartDocument.save();

    let roleDocument = await roleSchema.findOne({ name: newUser.role });
    if (roleDocument == null) {
      roleDocument = await roleSchema.findOne({ name: "client" });
    }

    const userDocument = await userSchema.create({
      ...newUser,
      cart: newCart,
      role: roleDocument,
    });

    return new User({
      id: userDocument._id,
      firstName: userDocument.firstName,
      lastName: userDocument.lastName,
      email: userDocument.email,
      password: userDocument.password,
      isAdmin: userDocument.isAdmin,
      role: userDocument.role,
      cart: userDocument.cart,
      documents: userDocument.documents,
      status: userDocument.status,
      lastConnection: userDocument.lastConnection,
    });
  }

  async updateUser(userId, user) {
    if (user.email) {
      const emailExists = await userSchema.findOne({ email: user.email });
      if (emailExists)
        throw new Error({
          message: "Email already exists",
        });
    }

    const samePassowrd = await userSchema.findOne({
      _id: userId,
      password: user.password,
    });

    const userDocument = await userSchema.findByIdAndUpdate(userId, user, {
      new: true,
    });

    return new User({
      id: userDocument._id,
      firstName: userDocument.firstName,
      lastName: userDocument.lastName,
      email: userDocument.email,
      isAdmin: userDocument.isAdmin,
      role: userDocument.role,
      cart: userDocument.cart,
      documents: userDocument.documents,
      status: userDocument.status,
      lastConnection: userDocument.lastConnection,
    });
  }

  async softDeleteInactiveUsers(inactiveUsers) {
    const userIds = inactiveUsers.map((user) => user.id);
    const result = await userSchema.updateMany(
      { _id: { $in: userIds } },
      { $set: { status: false } },
    );
    return result.modifiedCount;
  }

  async deleteUser(userId) {
    return await userSchema.findByIdAndDelete(userId);
  }
}
