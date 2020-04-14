import Joi from '@hapi/joi';

const paramSchemas = Joi.object({
    id: Joi.string().guid({
        version: ['uuidv4'],
    }),
});

export default paramSchemas;
