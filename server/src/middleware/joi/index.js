import { createValidator } from "express-joi-validation";
import {
  userSchemas,
  paramSchemas,
  mealSchemas,
  orderSchemas,
  menuSchemas,
  querySchemas
} from "./schemas";

const validator = createValidator({ passError: true });

const joi = {
  stripUnknown: true,
  allowUnknown: true
};
export const queryValidator = validator.query(querySchemas, { joi });
export const paramValidator = validator.params(paramSchemas);
export const orderValidator = validator.body(orderSchemas, { joi }),
export const menuValidator = validator.body(menuSchemas, { joi }),
export const updateMealValidator = validator.body(mealSchemas, { joi }),
export const createMealValidator = validator.body(mealSchemas, {
  joi: {
    presence: "required",
    ...joi
  }
}),
export const userLoginValidator = validator.body(userSchemas.login, { joi });
export const userSignupValidator = validator.body(userSchemas.signup, { joi });
