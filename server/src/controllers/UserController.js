import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Controller from "./Controller";

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
  login(req, res) {
    // get user details from db
    return this.Model.findOne({
      where: {
        email: req.body.email
      },
      attributes: { exclude: ["createdAt", "updatedAt"] }
    })
      .then(response => {
        if (!response) {
          return res.status(404).json({
            message: {
              login: "Incorrect email or password"
            }
          });
        }
        const isCorrectPassword = bcrypt.compareSync(
          req.body.password,
          response.password
        );

        if (isCorrectPassword) {
          this.message = "Login Successful";
          return this.sendResponseWithToken(res, response.toJSON());
        }
        return res.status(400).json({
          message: {
            login: "Incorrect email or password"
          }
        });
      })
      .catch(error => res.status(400).json(error.message));
  }

  /**
   *
   *
   * @param {any} req
   * @returns {obj} HTTP Response
   * @memberof UserController
   */
  signUp(req, res) {
    const { email, ...rest } = req.body;
    return this.Model.findOrCreate({
      where: {
        email
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      defaults: rest
    })
      .then(([data, created]) => {
        if (!created) {
          return res.status(400).json({
            email: "Email is not available"
          });
        }
        this.message = "Signup Successful";
        this.statusCode = 201;
        return this.sendResponseWithToken(res, data.toJSON());
      })
      .catch(error => res.status(400).json(error.message));
  }

  /**
   *
   *
   * @param {Sequelize<Model<Instance>>} user
   * @param {String} extraMessage
   * @returns {obj} HTTP Response
   * @memberof UserController
   */
   sendResponseWithToken(res, user) {
    const { isCaterer, userId, firstName } = user;
    const payload = {
      isCaterer,
      userId,
      firstName
    };
    const { password, ...data } = user;
    const token = jwt.sign(payload, process.env.TOKEN_PASSWORD, {
      expiresIn: process.env.TOKEN_EXPIRY || "6h"
    });
    if (token) {
      return res.status(this.statusCode).json({ data, message: this.message, token });
    }
  }
}

export default UserController;
