import Joi from "@hapi/joi";

const orderSchemas = Joi.object({
  meals: Joi.array().items(
    Joi.object({
      id: Joi.string()
        .guid({
          version: ["uuidv4"]
        })
        .required(),
      quantity: Joi.number().integer()
    })
  )
});

export default orderSchemas;
