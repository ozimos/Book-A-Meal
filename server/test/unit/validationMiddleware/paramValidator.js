/* eslint import/no-extraneous-dependencies: off */
import { expect } from "chai";
import { paramValidator } from "../../../src/middleware/joi";

context("paramSchemas validation", () => {
  const test = [
    {
      id: "add"
    },
    {
      id: "3.5"
    },
    {
      id: 3.5
    }
  ];
  const item = {
    id: "c848bf5c-27ab-4882-9e43-ffe178c82602"
  };

  test.forEach(elem => {
    it(`throws error for non-uuid ${typeof elem.id} parameter: ${
      elem.id
    }`, () => {
      const validation = () => Joi.attempt(elem, paramSchemas);
      expect(validation).to.throw();
    });
  });

  it("throws error for unknown parameter ", () => {
    const modified = { ...item, volume: "high" };

    const validation = () => Joi.attempt(modified, paramSchemas);
    expect(validation).to.throw();
  });

  it("does not throw error for uuid string parameter ", () => {
    expect(paramSchemas.validate(item)).to.deep.equal({
      value: item
    });
  });
});
