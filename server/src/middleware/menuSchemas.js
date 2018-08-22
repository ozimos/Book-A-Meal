import Joi from 'joi';

const menuSchemas = Joi.object({
  meals: Joi.array().items(Joi.string().guid({
    version: [
      'uuidv4'
    ]
  })),
});

export default menuSchemas;
