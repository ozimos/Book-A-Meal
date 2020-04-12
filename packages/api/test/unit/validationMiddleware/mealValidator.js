/* eslint import/no-extraneous-dependencies: off */
import { expect } from "chai";
import {
  createMealValidator,
  updateMealValidator
} from "../../../src/middleware/joi";

context("mealSchemas validation", () => {
  const meal = {
    title: "Spaghetti",
    description: "very good",
    // eslint-disable-next-line max-len
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/11/23/13/50/pumpkin-soup-2972858_960_720.jpg",
    price: "1500",
    volume: "high"
  };
  const { volume, ...validatedMeal } = { ...meal, price: 1500 };

  it("create fails when required fields are not in request body", () => {
    const { title, ...modified } = meal;
    createMealValidator({ body: modified }, {}, err => {
      expect(err.error.name).to.equal("ValidationError");
    });
  });

  it("update fails for empty request body", () => {
    createMealValidator({ body: {} }, {}, err => {
      expect(err.error.name).to.equal("ValidationError");
    });
  });

  it("update succeeds when some fields are not in request body", () => {
    const { title, ...body } = meal;
    const req = { body };
    const { title: titl, ...partial } = validatedMeal;
    updateMealValidator(req, {}, () => "done");
    expect(req.body).to.deep.equal(partial);
  });

  it("create succeeds with complete input", () => {
    const req = { body: meal };
    updateMealValidator(req, {}, () => "done");
    expect(req.body).to.deep.equal(validatedMeal);
  });
});
