import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Controller from './Controller';

export function tokenGenerator({ isCaterer, id: userId, firstName }) {
    return jwt.sign({ isCaterer, userId, firstName }, process.env.TOKEN_PASSWORD, {
        expiresIn: process.env.TOKEN_EXPIRY || '6h',
    });
}

/**
 *
 *
 * @class UserController
 */
class UserController extends Controller {
    /**
     * Creates an instance of UserController.
     * @param {any} Model
     * @memberof UserController
     */
    constructor(Model) {
        super(Model);
        this.login = this.login.bind(this);
        this.signUp = this.signUp.bind(this);
        this.sendResponseWithToken = this.sendResponseWithToken.bind(this);
    }

    /**
     *
     *
     * @param {any} req
     * @returns {obj} HTTP Response
     * @memberof UserController
     */
    login(req, res, next) {
        // get user details from db
        return this.Model.findOne({
            where: {
                email: req.body.email,
            },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        })
            .then((response) => {
                if (!response) {
                    return res.status(404).json({
                        message: {
                            login: 'Incorrect email or password',
                        },
                    });
                }
                const isCorrectPassword = bcrypt.compareSync(req.body.password, response.password);

                if (isCorrectPassword) {
                    const options = { message: 'Login Successful' };
                    return this.sendResponseWithToken(res, response.toJSON(), options);
                }
                return res.status(400).json({
                    message: {
                        login: 'Incorrect email or password',
                    },
                });
            })
            .catch((error) => next(error));
    }

    /**
     *
     *
     * @param {any} req
     * @returns {obj} HTTP Response
     * @memberof UserController
     */
    signUp(req, res, next) {
        const { email, ...rest } = req.body;
        return this.Model.findOrCreate({
            where: {
                email,
            },
            attributes: { exclude: ['createdAt', 'updatedAt', 'password'] },
            defaults: rest,
        })
            .then(([data, created]) => {
                if (!created) {
                    return res.status(400).json({
                        email: 'Email is not available',
                    });
                }
                const options = {
                    message: 'Signup Successful',
                    statusCode: 201,
                };
                return this.sendResponseWithToken(res, data.toJSON(), options);
            })
            .catch((error) => next(error));
    }

    /**
     *
     * @param {any} res
     * @param {Sequelize<Model<Instance>>} user
     * @param {obj} options
     * @returns {obj} HTTP Response
     * @memberof UserController
     */
    sendResponseWithToken(res, user, { statusCode = 200, message }) {
        const { password, ...data } = user;
        const token = tokenGenerator(user);
        if (token) {
            return res.status(statusCode).json({ data, message, token });
        }
    }
}

export default UserController;
