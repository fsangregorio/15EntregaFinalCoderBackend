
import chai from "chai";
import dotenv from "dotenv";
import DbFactory from "../../data/factories/dbFactory.js";
import RoleMongooseRepository from "../../data/repositories/mongoose/roleMongooseRepository.js";

dotenv.config();

const expect = chai.expect;

const db = await DbFactory.create(process.env.DB);
db.init(process.env.DB_URI);

describe("Testing Role Mongoose Repository", function () {
  before(function () {
    this.roleRepository = new RoleMongooseRepository();
  });

  it("Repository should get all roles", function () {
    this.roleRepository.getRoles({ limit: 10 }).then((result) => {
      expect.strictEqual(Array.isArray(result.roles), true);
    });
  });

  it("Repository should get role by name", function () {
    this.roleRepository.getRoleByName("client").then((result) => {
      expect.strictEqual(result.role.name, "client");
    });
  });

  it("Repository shoud create a role", function () {
    this.roleRepository.createRole({ name: "test" }).then((result) => {
      expect.strictEqual(result.role.name, "test");
    });
  });

  it("Repository should update a role", function () {
    this.roleRepository.updateRole({ name: "testUpdated" }).then((result) => {
      expect.strictEqual(result.role.name, "testUpdated");
    });
  });
  
  it("Repository should delete role", function () {
    this.roleRepository.deleteRole({ name: "testUpdated" }).then((result) => {
      expect.strictEqual(result.role.name, "testUpdated");
    });
  });
});
