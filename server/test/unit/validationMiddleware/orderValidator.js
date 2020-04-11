/* eslint import/no-extraneous-dependencies: off */
import { expect } from "chai";
import { orderValidator } from "../../../src/middleware/joi";

context("orderSchemas validation", () => {
  const order =  [
      {
        id: "20a0dcc4-0a78-43f6-881b-884dd6f32861"
      },
      {
        id: "974f67bd-6e3d-4338-a916-fd837ce1a753",
        quantity: "2"
      }
    ]
  const validatedOrder =  [
      {
        id: "20a0dcc4-0a78-43f6-881b-884dd6f32861",
        quantity: 1
      },
      {
        id: "974f67bd-6e3d-4338-a916-fd837ce1a753",
        quantity: 2
      }
    ]

  it("fails when meals field not in order", () => {
    const { meals, ...modified } = order;
    orderValidator({ body: modified }, {}, err => {
      expect(err.error.name).to.equal("ValidationError");
    });
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
      const modified =  [
          elem,
          {
            id: "20a0dcc4-0a78-43f6-881b-884dd6f32861",
            quantity: "3"
          }
        ]
      orderValidator({ body: modified }, {}, err => {
        expect(err.error.name).to.equal("ValidationError");
      });
    });
  });

  it("fails for empty meals in order", () => {
    const modified = [];
    orderValidator({ body: modified }, {}, err => {
      expect(err.error.name).to.equal("ValidationError");
    });
  });

  it("succeeds with correct input", () => {
    const req = { body: order };
    orderValidator(req, {}, () => "done");
    expect(req.body).to.deep.equal(validatedOrder);
  });
});
