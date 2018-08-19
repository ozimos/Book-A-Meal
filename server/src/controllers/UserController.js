import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Controller from './Controller';

/**
 *
 *
 * @class UserController
 */
class UserController extends Controller {
  /**
   *
   *
   * @param {any} req
   * @returns {obj} HTTP Response
   * @memberof UserController
   */
  login(req) {
    // get user details from db
    return this.Model
      .findOne({
        where: {
          email: req.body.email
        },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      }).then((response) => {
        if (!response) {
          return UserController.errorResponse({
            email: 'Incorrect email or password'
          }, 404);
        }
        // check if password is correct
        const isCorrectPassword = bcrypt
          .compareSync(req.body.password, response.password);

        if (isCorrectPassword) {
          return UserController.sendResponseWithToken(response);
        }
        return UserController.errorResponse({
          password: 'Incorrect email or password'
        }, 404);
      }).catch(error => UserController.errorResponse(error.message));
  }


  /**
   *
   *
   * @param {any} req
   * @returns {obj} HTTP Response
   * @memberof UserController
   */
  signUp(req) {
    const {
      email,
      ...rest
    } = req.body;
    // check if email is available
    return this.Model.findOrCreate({
      where: {
        email
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      defaults: rest
    }).then(([response, created]) => {
      if (!created) {
        return UserController.errorResponse({
          email: 'Email is not available'
        });
      }
      return UserController
        .sendResponseWithToken(response, 'Signup Successful, ', 201);
    })
      .catch(error => UserController.errorResponse(error.message));
  }

  static checkUser(req, res) {
    const {
      isCaterer
    } = req.decoded;
    res.status(200).json({
      data: {
        isCaterer
      }
    });
  }


  /**
   *
   *
   * @param {Sequelize<Model<Instance>>} data
   * @param {String} extraMessage
   * @returns {obj} HTTP Response
   * @memberof UserController
   */
  static sendResponseWithToken(user, extraMessage = '', code = 200) {
    const data = user.dataValues ? { ...user.dataValues
    } : user;
    let message = extraMessage;
    const payload = {
      isCaterer: data.isCaterer,
      userId: data.id
    };
    if (data.password) {
      delete data.password;
    }
    const token = jwt.sign(payload, process.env.TOKEN_PASSWORD, {
      expiresIn: '6h'
    });
    if (token) {
      message = `${message}Login Successful`;
      return UserController.defaultResponse(data, code, message, token);
    }
  }
}

export default UserController;
