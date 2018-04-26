import Joi from 'joi';

const modifyMeal = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  price: Joi.number(),
});

const params = Joi.object({
  id: Joi.number().integer()
});

export default {
  modifyMeal,
  createMeal: modifyMeal.options({
    presence: 'required'
  }),
  params
};