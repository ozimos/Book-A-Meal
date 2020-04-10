import Joi from "@hapi/joi";

const meals = Joi.object({
  mealId: Joi.string()
    .guid({
      version: ["uuidv4"],
    })
    .required(),
  quantity: Joi.number().integer().positive().max(100).default(1),
})

export default Joi.array()
  .unique("mealId")
  .items(meals.required())
  .required();
