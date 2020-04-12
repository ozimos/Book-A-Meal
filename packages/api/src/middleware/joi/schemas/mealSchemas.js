import Joi from "@hapi/joi";

const defaultString = Joi.string()
  .trim()
  .min(1)
  .max(256)
  .truncate();

const mealSchemas = Joi.object({
  title: defaultString,
  description: defaultString,
  imageUrl: defaultString.uri(),
  price: Joi.number()
}).min(1);

export default mealSchemas;
