/* eslint import/no-extraneous-dependencies: off */
import { expect } from "chai";
import Joi from "@hapi/joi";
import { mealSchemas } from "../../../src/middleware/joi/schemas";
import { joi } from "../../../src/middleware/joi/validationSettings";

context("mealSchemas validation", () => {
  const meal = {
    title: "Spaghetti",
    description: "very good",
    // eslint-disable-next-line max-len
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/11/23/13/50/pumpkin-soup-2972858_960_720.jpg",
    price: "1500"
  };
  const validatedMeal = { ...meal, price: 1500 };

  it("fails when required fields are not in request body", () => {
    const { title, ...modified } = meal;
    const validation = () =>
      Joi.attempt(modified, mealSchemas, { ...joi, presence: "required" });
    expect(validation).to.throw('"title" is required');
  });

  it("succeeds with correct input", () => {
    const modified = { ...meal, volume: "high" };
    expect(mealSchemas.validate(modified, joi)).to.deep.equal({
      value: validatedMeal
    });
  });
});
