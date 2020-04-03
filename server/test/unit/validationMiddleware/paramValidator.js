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
  const initParams = {
    id: "c848bf5c-27ab-4882-9e43-ffe178c82602"
  };

  test.forEach(params => {
    it(`throws error for non-uuid ${typeof params.id} parameter: ${
      params.id
    }`, () => {
      paramValidator({ params }, {}, err => {
        expect(err.error.name).to.equal("ValidationError");
      });
    });
  });

  it("throws error for unknown parameter ", () => {
    const params = { ...initParams, volume: "high" };
    paramValidator({ params }, {}, err => {
      expect(err.error.name).to.equal("ValidationError");
    });
  });

  it("does not throw error for uuid string parameter ", () => {
    const params = initParams;
    paramValidator({ params }, {}, () => "done");
    expect(params).to.deep.equal(initParams);
  });
});
