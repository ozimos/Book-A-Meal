import Joi from '@hapi/joi';

export default Joi.array()
    .unique()
    .items(
        Joi.string()
            .guid({
                version: ['uuidv4'],
            })
            .required(),
    )
    .required();
