/* eslint import/no-extraneous-dependencies: off */
import { assert } from "chai";
import { userSchemas } from "../../../src/middleware/joi/schemas";

describe("for POST requests on /api/v1/auth/signup, validation", () => {
  // sample request body data
  const postUserData = {
    firstName: "Tovieye",
    lastName: "Ozi",
    email: "ad.min@gmail.com",
    password: "abc123",
    confirmPassword: "abc123",
    isCaterer: true
  };

  it("throws error when some required fields are not in request body", () => {
    const modified = { ...postUserData };
    delete modified.firstName;
    const result = userSchemas.signup.validate(modified);

    assert.notEqual(result.error, null, `Joi output: ${result.error}`);
  });

  it("throws error when unknown fields are in request body", () => {
    const modified = { ...postUserData };
    modified.volume = "high";
    const result = userSchemas.signup.validate(modified);

    assert.notEqual(result.error, null, `Joi output: ${result.error}`);
  });

  it("throws error for non matching passwords", () => {
    const modified = { ...postUserData };
    modified.password = "high";
    const result = userSchemas.signup.validate(modified);

    assert.equal(
      `${result.error}`,
      'ValidationError: child "password" fails because [passwords do not match]'
    );
  });

  it("converts email to lowercase", () => {
    const modified = { ...postUserData };
    modified.email = "AD.MIN@gMaIL.com";
    const result = userSchemas.signup.validate(modified);

    assert.deepEqual(
      result.value.email,
      postUserData.email,
      `Joi output: ${result.error}`
    );
  });
  it(
    "does not throw error when all required fields " + "are in request body",
    () => {
      const result = userSchemas.signup.validate(postUserData);

      assert.equal(result.error, null, `Joi output: ${result.error}`);
    }
  );
});
