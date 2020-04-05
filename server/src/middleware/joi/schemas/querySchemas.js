import Joi from "@hapi/joi";

const querySchemas = Joi.object({
  limit: Joi.number()
    .integer()
    .min(0),
  offset: Joi.number()
    .integer()
    .min(0),
  date: Joi.date().iso()
});

export default querySchemas;
