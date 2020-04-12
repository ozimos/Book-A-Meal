import {
  expect,
  request,
  userFactory,
  rootURL,
  getUserInfo,
} from "../appHelper";
import app from "../../src/app";
import db from "../../src/models";

const password = "Thisis@testp@55w0rd";

const newUser = userFactory({
  password: password,
  extraField: "handles extra fields without error",
  confirmPassword: password,
});
const defaultUser = userFactory({ password });

describe("Routes Users", () => {
  before("set up users", async () => {
    await db.User.truncate({ cascade: true });
    await db.User.create(defaultUser);
  });

  describe("POST /auth/signup", () => {
    const signUpUrl = `${rootURL}/auth/signup`;

    it("should signup a new user", () =>
      request(app)
        .post(signUpUrl)
        .send(newUser)
        .then((res) => {
          expect(res.body.data).to.not.have.property("password");
          expect(res.body.data).to.containSubset(getUserInfo(newUser));
          expect(res.body.token).to.be.a("string");
          expect(res).to.have.status(201);
        }));

    it("should not signup a new user without required fields", () => {
      return request(app)
        .post(signUpUrl)
        .send({})
        .then((res) => {
          expect(res.body.message).to.deep.equal({
            lastName: '"lastName" is required',
            email: '"email" is required',
            confirmPassword: '"confirmPassword" is required',
            password: '"password" is required',
            firstName: '"firstName" is required',
          });
          expect(res).to.have.status(400);
        });
    });

    it("should not signup a new user with invalid fields", () => {
      return request(app)
        .post(signUpUrl)
        .send({
          firstName: "Meow",
          lastName: "Felidae",
          email: "tabs@cos",
          password,
          confirmPassword: "meowmeow",
        })
        .then((res) => {
          expect(res.body.message).to.deep.equal({
            email: '"email" must be a valid email',
            confirmPassword: "passwords do not match",
          });
          expect(res).to.have.status(400);
        });
    });
  });

  describe("POST /auth/login", () => {
    const logInUrl = `${rootURL}/auth/login`;

    const credentials = {
      email: defaultUser.email,
      extraField: "handles extra fields without error",
      password,
    };

    it("should login existing user", () =>
      request(app)
        .post(logInUrl)
        .send(credentials)
        .then((res) => {
          expect(res.body.data).to.containSubset(
            getUserInfo(defaultUser, "id")
          );
          expect(res.body.data).to.not.have.property("password");
          expect(res.body.token).to.be.a("string");
        }));

    it("should not login a user with wrong email", () =>
      request(app)
        .post(logInUrl)
        .send({ ...credentials, email: "wrong@email.com" })
        .then((res) => {
          expect(res.body.message).to.deep.equal({
            login: "Incorrect email or password",
          });
        }));

    it("should not login a user with wrong password", () =>
      request(app)
        .post(logInUrl)
        .send({ ...credentials, password: "wrongpassword" })
        .then((res) => {
          expect(res.body.message).to.deep.equal({
            login: "Incorrect email or password",
          });
        }));

    it("should not login a new user without required fields", () => {
      return request(app)
        .post(logInUrl)
        .send({})
        .then((res) => {
          expect(res.body.message).to.deep.equal({
            email: '"email" is required',
            password: '"password" is required',
          });
          expect(res).to.have.status(400);
        });
      });
  });
});
