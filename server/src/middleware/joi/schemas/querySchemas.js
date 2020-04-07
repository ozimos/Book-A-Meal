import Joi from "@hapi/joi";

const querySchemas = Joi.object({
  limit: Joi.number()
    .integer()
    .min(0),
  offset: Joi.number()
    .integer()
    .min(0),
  date: [Joi.date().iso(), Joi.any().valid('all')],
  end: Joi.date().iso(),
  caterer: Joi.boolean()
});

export default querySchemas;
