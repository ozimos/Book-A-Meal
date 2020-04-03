import Joi from "@hapi/joi";

const orderSchemas = Joi.object({
  meals: Joi.array().unique('id').items(
    Joi.object({
      id: Joi.string()
        .guid({
          version: ["uuidv4"]
        })
        .required(),
      quantity: Joi.number().integer().positive().default(1).max(100)
    }) .required()
  ).required()
});

export default orderSchemas;
