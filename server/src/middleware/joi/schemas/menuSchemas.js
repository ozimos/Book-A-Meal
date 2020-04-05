import Joi from "@hapi/joi";

const menuSchemas = Joi.object({
  meals: Joi.array()
    .unique()
    .items(
      Joi.string()
        .guid({
          version: ["uuidv4"]
        })
        .required()
    )
    .required(),
});

export default menuSchemas;
