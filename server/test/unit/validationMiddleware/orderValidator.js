/* eslint import/no-extraneous-dependencies: off */
import { expect } from "chai";
import Joi from "@hapi/joi";
import { joi } from "../../../src/middleware/joi";
import { orderSchemas } from "../../../src/middleware/joi/schemas";

context.only("orderSchemas validation", () => {
  const order = {
    meals: [
      {
        id: "20a0dcc4-0a78-43f6-881b-884dd6f32861"
      },
      {
        id: "974f67bd-6e3d-4338-a916-fd837ce1a753",
        quantity: "2"
      }
    ]
  };
  const validatedOrder = {
    meals: [
      {
        id: "20a0dcc4-0a78-43f6-881b-884dd6f32861",
        quantity: 1
      },
      {
        id: "974f67bd-6e3d-4338-a916-fd837ce1a753",
        quantity: 2
      }
    ]
  };

  it("fails when meals field not in order", () => {
    const { meals, ...modified } = order;
    const validation = () => Joi.attempt(modified, orderSchemas, joi);
    expect(validation).to.throw('"meals" is required');
  });
  const test = [
    {
      quantity: 1,
      message: "required"
    },
    {
      id: "20a0dcc4-0a78-434f-881b-884dd6f32861",
      quantity: "yes",
      message: "number"
    },
    {
      id: "20a0dcc4-0a78-43f6-881b-884dd6f32861",
      quantity: 2,
      message: "duplicate"
    },
    {
      id: "20a0dcc4-0a8-43f6-881b-884dd6f32861",
      quantity: 2,
      message: "GUID"
    },
    {
      id: "974f67bd-6e3d-4338-a916-fd837ce1a753",
      quantity: -2,
      message: "positive"
    }
  ];

  test.forEach(elem => {
    it(`fails ${elem.message} test`, () => {
      const modified = {
        meals: [
          elem,
          {
            id: "20a0dcc4-0a78-43f6-881b-884dd6f32861",
            quantity: "3"
          }
        ]
      };
      const validation = () =>
        Joi.attempt(modified, orderSchemas, { ...joi, abortEarly: false });
      expect(validation).to.throw();
    });
  });

  it("fails for empty meals in order", () => {
    const modified = { meals: [] };
    const validation = () => Joi.attempt(modified, orderSchemas, joi);
    expect(validation).to.throw();
  });

  it("succeeds with correct input", () => {
    const modified = { ...order, volume: "high" };
    expect(orderSchemas.validate(modified, joi)).to.deep.equal({
      value: validatedOrder
    });
  });
});
