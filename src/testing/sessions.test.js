
import chai from "chai";
import { faker } from "@faker-js/faker";
import supertest from "supertest";
import initServer from "./index.js";

const expect = chai.expect;
let jwt = "";

describe("Testing sessions endpoints", () => {
  before(async function () {
    const { app, db } = await initServer();
    const application = app.callback();
    this.requester = supertest.agent(application);
    this.app = app;
    this.db = db;
    this.payload = {};
  });

  after(async function () {
    await this.db.clear();
    await this.db.close();
    this.requester.app.close(() => {
      console.log("Connection lost");
    });
  });

  beforeEach(async function () {
    this.timeout(2000);
    await new Promise((resolve) => setTimeout(resolve, 1500));
  });

  it("Create account", async function () {
    this.payload = {
      firstName: `${faker.person.firstName()} Jane`,
      lastName: `${faker.person.lastName()} Doe`,
      email: faker.internet.email(),
      age: 21,
      password: "abc123",
    };

    const { status, _body } = await this.requester
      .post("/api/sessions/signup")
      .send(this.payload);

    expect(status).to.be.equals(201);
    expect(_body.payload.email).to.be.equals(this.payload.email);
    expect(_body.message).to.be.equals("Signup successful.");
  });

  it("Account login", async function () {
    const payload = {
      email: this.payload.email,
      password: this.payload.password,
    };

    const { _body, status } = await this.requester
      .post("/api/sessions/login")
      .send(payload);

    expect(status).to.be.equals(200);
    expect(_body.message).to.be.equals("Login successful.");

    jwt = _body.accessToken;
  });

  it("Get", async function () {
    this.payload = {
      email: this.payload.email,
      password: this.payload.password,
    };

    const { _body, status } = await this.requester
      .get("/api/sessions/current")
      .set("Authorization", `Bearer ${jwt}`);
    expect(status).to.be.equals(200);
    expect(_body.payload.email).to.be.equals(this.payload.email);
  });
});
