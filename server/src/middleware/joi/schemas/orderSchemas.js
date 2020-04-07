import Joi from "@hapi/joi";

export default Joi.array()
  .unique("id")
  .items(
    Joi.object({
      mealId: Joi.string()
        .guid({
          version: ["uuidv4"],
        })
        .required(),
      quantity: Joi.number().integer().positive().default(1).max(100),
    }).required()
  )
  .required();
