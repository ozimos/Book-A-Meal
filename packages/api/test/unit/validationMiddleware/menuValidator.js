/* eslint import/no-extraneous-dependencies: off */
import { expect } from "chai";
import { menuValidator } from "../../../src/middleware/joi";

context("menuSchemas validation", () => {
  const menu = [
    "db5e4fa9-d4df-4352-a2e4-bc57f6b68e9b",
    "974f67bd-6e3d-4338-a916-fd837ce1a753"
  ];

  it("fails for empty meals in menu", () => {
    const body = [];
    menuValidator({ body }, {}, err => {
      expect(err.error.name).to.equal("ValidationError");
    });
  });

  it("fails for duplicate meals in menu", () => {
    const body = menu.push(menu[0]);
    menuValidator({ body }, {}, err => {
      expect(err.error.name).to.equal("ValidationError");
    });
  });

  it("succeeds with correct input", () => {
    const req = { body: menu };
    menuValidator(req, {}, () => "done");
    expect(req.body).to.deep.equal(menu);
  });
});
