import jwt from 'jsonwebtoken';

/**
 *
 *
 * @export
 * @class authenticate
 */
export default class Authenticate {
    /**
     *
     *
     * @static
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @returns {function} any
     * @memberof authenticate
     */
    static isUser(req, res, next) {
        const bearerHeader = req.headers.authorization;
        if (typeof bearerHeader === 'undefined') {
            return res.status(401).json({
                message: 'No token provided.',
            });
        }
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        jwt.verify(token, process.env.TOKEN_PASSWORD, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: err.message,
                });
            }
            req.decoded = decoded;
        });
        return next();
    }

    /**
     *
     *
     * @static
     * @param {any} req
     * @param {any} res
     * @param {any} next
     * @returns {function} any
     * @memberof authenticate
     */
    static isAdmin(req, res, next) {
        if (req.decoded && req.decoded.isCaterer) {
            return next();
        }
        return res.status(403).json({
            message: 'You Are not Authorized to access this page!',
        });
    }
}
