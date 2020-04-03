import Joi, {ValidationError} from "@hapi/joi";

const defaultString = Joi.string()
  .trim()
  .min(1)
  .max(256)
  .truncate();
const email = defaultString
  .email()
  .lowercase()
  .required();
const login = Joi.object({
  email,
  password: defaultString.required()
});
const signup = Joi.object({
  firstName: defaultString.required(),
  lastName: defaultString.required(),
  email,
  password: Joi.any()
    .valid(Joi.ref("confirmPassword"))
    .error(new ValidationError("passwords do not match")),
  confirmPassword: defaultString.strip().required(),
  isCaterer: Joi.boolean().default(false)
});

export default {
  signup,
  login
};
