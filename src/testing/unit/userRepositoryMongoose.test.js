
import chai from "chai";
import dotenv from "dotenv";
import DbFactory from "../../data/factories/dbFactory.js";
import UserMongooseRepository from "../../data/repositories/mongoose/userMongooseRepository.js";
import { faker } from "@faker-js/faker";

dotenv.config();

const expect = chai.expect;

const db = await DbFactory.create(process.env.DB);
db.init(process.env.DB_URI);

describe("Testing User Mongoose Repository", () => {
  before(async function () {
    this.userRepository = new UserMongooseRepository();
  });
  beforeEach(async function () {
    this.timeout(2000);
    await new Promise((resolve) => setTimeout(resolve, 1500));
  });

  it("Repository should be an instance of UserMongooseRepository", function () {
    expect(this.userRepository instanceof UserMongooseRepository).to.be.ok;
  });
  it("Repository should return an array", function () {
    this.userRepository.getUsers({ limit: 10 }).then((result) => {
      expect.strictEqual(Array.isArray(result.users), true);
    });
  });

  it("Repository should create a user", function () {
    const user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      age: 21,
      isAdmin: false,
      password: abc123,
    };

    this.userRepository.createUser(user).then((result) => {
      expect(result.firstName).to.be.equals(user.firstName);
      expect(result.email).to.be.equals(user.email);
    });
  });

  it("Repository should update a user", function () {
    const user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      age: 21,
      isAdmin: false,
      password: "abc123",
    };

    this.timeout(5000);

    this.userRepository.createUser(user).then((createdUser) => {
      const updatedUser = {
        ...createdUser,
        firstName: faker.person.firstName(),
        age: 22,
      };

      this.userRepository.updateUser(updatedUser).then((result) => {
        assert.strictEqual(result.firstName, updatedUser.firstName);
        assert.strictEqual(result.age, updatedUser.age);
      });
    });
  });

  it("Repository should delete a user", function () {
    const user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      age: 21,
      isAdmin: false,
      password: "abc123",
    };

    this.timeout(5000);

    this.userRepository.createUser(user).then((createdUser) => {
      this.userRepository.deleteUser(createdUser).then((deletedUser) => {
        assert.strictEqual(deletedUser.id, createdUser.id);
      });
    });
  });

  it("Repository should get user by ID", function () {
    const user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      age: 21,
      isAdmin: false,
      password: "",
    };

    this.timeout(5000);

    this.userRepository.createUser(user).then((createdUser) => {
      this.userRepository.getUserById(createdUser.id).then((result) => {
        assert.strictEqual(result.id, createdUser.id);
      });
    });
  });
});
