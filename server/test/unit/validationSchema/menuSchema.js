/* eslint import/no-extraneous-dependencies: off */
import { assert } from "chai";
import { menuSchemas } from "../../../src/middleware/joi/schemas";

context("Validation with Joi schemas", () => {
  // sample request body data
  const menu = {
    meals: [
      "db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b",
      "974f67bd-6e3d-4338-a916-fd837ce1a753"
    ]
  };

  describe("for POST requests on /api/v1/menu, validation", () => {
    it("throws error when unknown fields are in request body", () => {
      const modified = { ...menu };
      modified.volume = "high";
      const result = menuSchemas.validate(modified);

      assert.notEqual(result.error, null, `Joi output: ${result.error}`);
    });

    it("does not throw error when all required fields are in request body", () => {
      const result = menuSchemas.validate(menu);

      assert.equal(result.error, null, `Joi output: ${result.error}`);
    });
  });
});
