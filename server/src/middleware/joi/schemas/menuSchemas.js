import Joi from "@hapi/joi";

const menuSchemas = Joi.object({
  meals: Joi.array().items(
    Joi.string().guid({
      version: ["uuidv4"]
    })
  )
});

export default menuSchemas;
