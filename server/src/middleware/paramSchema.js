import Joi from "@hapi/joi";

const paramSchema = Joi.object({
  id: Joi.string().guid({
    version: ["uuidv4"]
  }),
  date: Joi.date()
});

export default paramSchema;
