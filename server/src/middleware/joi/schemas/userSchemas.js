import Joi from "@hapi/joi";

const defaultString = Joi.string()
  .trim()
  .min(1)
  .max(256)
  .truncate();
const login = Joi.object({
  email: defaultString.email().required(),
  password: defaultString.required()
});
const signup = Joi.object({
  firstName: defaultString.required(),
  lastName: defaultString.required(),
  email: defaultString
    .email()
    .lowercase()
    .required(),
  password: Joi.any()
    .valid(Joi.ref("confirmPassword"))
    .error(() => "passwords do not match"),
  confirmPassword: defaultString.strip().required(),
  isCaterer: Joi.boolean()
});

export default {
  signup,
  login
};
