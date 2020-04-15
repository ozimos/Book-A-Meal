import { createValidator } from 'express-joi-validation';
import {
    userSchemas,
    paramSchemas,
    mealSchemas,
    orderSchemas,
    menuSchemas,
    querySchemas,
} from './schemas';

const validator = createValidator({ passError: true });

export const options = {
    joi: {
        stripUnknown: true,
        allowUnknown: true,
        convert: true,
        abortEarly: false,
    },
};
export const queryValidator = validator.query(querySchemas, options);
export const paramValidator = validator.params(paramSchemas);
export const orderValidator = validator.body(orderSchemas, options);
export const menuValidator = validator.body(menuSchemas, options);
export const updateMealValidator = validator.body(mealSchemas, options);
export const createMealValidator = validator.body(mealSchemas, {
    joi: { presence: 'required', ...options.joi },
});
export const userLoginValidator = validator.body(userSchemas.login, options);
export const userSignupValidator = validator.body(userSchemas.signup, options);
