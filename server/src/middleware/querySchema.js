import Joi from 'joi';

const querySchema = Joi.object({
  limit: Joi.number().integer().min(0),
  offset: Joi.number().integer().min(0),
  date: Joi.date().iso(),
});

export default querySchema;
