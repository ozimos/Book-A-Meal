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
            data: {
              password: "Incorrect email or password"
            }
          });
        }
        // check if password is correct
        const isCorrectPassword = bcrypt.compareSync(
          req.body.password,
          response.password
        );

        if (isCorrectPassword) {
          return UserController.sendResponseWithToken(res, response);
        }
        return res.status(400).json({
          data: {
            password: "Incorrect email or password"
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
    // check if email is available
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
        return UserController.sendResponseWithToken(
          res,
          data,
          "Signup Successful, ",
          201
        );
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
  static sendResponseWithToken(res, user, extraMessage = "", code = 200) {
    const userData = user.dataValues ? { ...user.dataValues } : user;
    const payload = {
      isCaterer: data.isCaterer,
      userId: data.id,
      firstName: data.firstName
    };
    const { password, ...data } = userData;
    const token = jwt.sign(payload, process.env.TOKEN_PASSWORD, {
      expiresIn: "6h"
    });
    if (token) {
      const message = `${extraMessage}Login Successful`;
      return res.status(code).json({ data, message, token });
    }
  }
}

export default UserController;
