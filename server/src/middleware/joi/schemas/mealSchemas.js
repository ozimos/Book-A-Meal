import Joi from "@hapi/joi";

const defaultString = Joi.string()
  .trim()
  .min(1)
  .max(256)
  .truncate();

const modifyMeal = Joi.object({
  title: defaultString,
  description: defaultString,
  imageUrl: defaultString.uri(),
  price: Joi.number()
}).options({
  stripUnknown: true
});

export default {
  modifyMeal,
  createMeal: modifyMeal.options({
    presence: "required",
  })
};
