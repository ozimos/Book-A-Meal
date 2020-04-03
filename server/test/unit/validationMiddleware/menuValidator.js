/* eslint import/no-extraneous-dependencies: off */
import { expect } from "chai";
import Joi from "@hapi/joi";
import { joi } from "../../../src/middleware/joi/validationSettings";
import { menuSchemas } from "../../../src/middleware/joi/schemas";

context("menuSchemas validation", () => {
  const menu = {
    meals: [
      "db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b",
      "974f67bd-6e3d-4338-a916-fd837ce1a753"
    ],
    menuDate: new Date()
  };

  it("fails when meals field not in menu", () => {
    const { meals, ...modified } = menu;
    const validation = () =>
      Joi.attempt(modified, menuSchemas, joi);
    expect(validation).to.throw('"meals" is required');
  });

  it("fails for empty meals in menu", () => {
    const modified = {...menu, meals: []};
    const validation = () =>
      Joi.attempt(modified, menuSchemas, joi);
    expect(validation).to.throw();
  });

  it("fails for duplicate meals in menu", () => {
    const modified = {...menu, meals: ["db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b", "db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b",]};
    const validation = () =>
      Joi.attempt(modified, menuSchemas, joi);
    expect(validation).to.throw();
  });

  it("succeeds with correct input", () => {
    const modified = { ...menu, volume: "high" };
    expect(menuSchemas.validate(modified, joi)).to.deep.equal({
      value: menu
    });
  });
});
