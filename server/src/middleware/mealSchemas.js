import Joi from 'joi';

const defaultString = Joi.string().trim().min(1).max(256)
  .truncate();

const modifyMeal = Joi.object({
  title: defaultString,
  description: defaultString,
  imageUrl: defaultString.uri(),
  price: Joi.number(),
});


export default {
  modifyMeal,
  createMeal: modifyMeal.options({
    presence: 'required'
  })
};