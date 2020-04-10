import { EmptyResultError } from "sequelize";
import mergeWith from "lodash/mergeWith";
import formatISO from "date-fns/formatISO";

function customizer(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}
/**
 *
 *
 * @class Controller
 */
class Controller {
  /**
   * Creates an instance of Controller.
   * @param {any} Model
   * @memberof Controller
   */
  constructor(Model) {
    this.Model = Model;
    this.config = {};
    this.postRecord = this.postRecord.bind(this);
    this.getSingleRecord = this.getSingleRecord.bind(this);
    this.getAllRecords = this.getAllRecords.bind(this);
    this.updateRecord = this.updateRecord.bind(this);
    this.deleteRecord = this.deleteRecord.bind(this);
    this.transformer = this.transformer.bind(this);
    this.mergeOptions = this.mergeOptions.bind(this);
    this.setDiscrimDate = this.setDiscrimDate.bind(this);
    this.cloneResetConfig = this.cloneResetConfig.bind(this);
    this.setAccessMode = this.setAccessMode.bind(this);
  }

  /**
   *
   *
   * @param {any} response
   * @returns {obj}
   * @memberof Controller
   */
  transformer(response) {
    return response;
  }

  /**
   *
   *
   * @returns {obj}
   * @memberof Controller
   */
  cloneResetConfig() {
    const config = { ...this.config };
    this.config = {};
    return config;
  }

  /**
   *
   *
   * @param {any} init
   * @param {any} mod
   * @returns {obj}
   * @memberof Controller
   */
  mergeOptions(init, mod) {
    return mergeWith(init, mod, customizer);
  }

  /**
   *
   *
   * @param {any} req
   * @returns {obj}
   * @memberof Controller
   */
  setDiscrimDate(req) {
    const date = req.query.date;
    const hasDateRange = date !== "all";
    let start, end;
    if (hasDateRange) {
      const startDate = date ? new Date(date) : new Date();
      start = formatISO(startDate.setHours(0, 0, 0, 0));
      const endDate = req.query.end ? new Date(req.query.end) : new Date(start);
      end = formatISO(endDate.setHours(24, 0, 0, 0));
    }
    return { method: ["discriminatingDate", hasDateRange, start, end] };
  }

  /**
   *
   *
   * @param {any} req
   * @returns {obj}
   * @memberof Controller
   */
  setAccessMode(req) {
    const { userId, isCaterer } = req.decoded;
    return {
      method: ["accessMode", Boolean(isCaterer && req.query.caterer), userId],
    };
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} res
   * @returns {obj} HTTP Response
   * @memberof Controller
   */
  postRecord(req, res, next) {
    return this.Model.create(req.body, { returning: true })
      .then((data) => res.status(201).json({ data }))
      .catch((error) => next(error));
  }

  /**
   *
   *
   * @param {any} req express object
   * @param {any} res express object
   * @param {function} acceptCallback error decision callback
   * @param {boolean} raw return raw results
   * @returns {obj} Model
   * @memberof Controller
   */
  getAllRecords(req, res, next) {
    const {
      scopes,
      message: altMessage,
      statusCode = 200,
      options,
    } = this.cloneResetConfig();
    let { offset = 0, limit = 8 } = req.query;

    return this.Model.scope(scopes)
      .findAndCountAll({ ...options, limit, offset })
      .then((result) => {
        const { count, rows } = result;
        const pages = Math.ceil(count / limit);
        return res.status(statusCode).json({
          data: this.transformer({ limit, offset, pages, count, rows }),
        });
      })
      .catch((error) => {
        if (error instanceof EmptyResultError) {
          const message = altMessage || "no records available";
          return res.status(404).json({ message });
        }
        next(err);
      });
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} res
   * @returns {obj} Model
   * @memberof Controller
   */
  getSingleRecord(req, res, next) {
    const {
      scopes,
      message: altMessage,
      statusCode = 200,
      options,
    } = this.cloneResetConfig();
    return this.Model.scope(scopes)
      .findByPk(req.params.id, options)
      .then((data) => {
        if (!data) {
          const message = altMessage || "no records available";
          return res.status(404).json({ message });
        }
        return res.status(statusCode).json({ data });
      })
      .catch((error) => next(error));
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} res
   * @returns {obj} Model
   * @memberof Controller
   */
  updateRecord(req, res, next) {
    const { scopes, message: altMessage } = this.cloneResetConfig();
    return this.Model.scope(scopes)
      .update(req.body, {
        where: {
          id: req.params.id,
        },
        returning: true,
      })
      .then(([count, [data]]) => {
        if (count > 0) {
          return res.status(200).json({ data });
        }
        const message = altMessage || "no records available";
        return res.status(404).json({ message });
      })
      .catch((error) => next(error));
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} res
   * @returns {obj} Model
   * @memberof Controller
   */
  deleteRecord(req, res, next) {
    const {
      scopes,
      message: altMessage,
      options = {},
    } = this.cloneResetConfig();
    return this.Model.scope(scopes)
      .destroy(
        this.mergeOptions(
          {
            rejectOnEmpty: true,
            where: { id: req.params.id, userId: req.decoded.userId },
          },
          options
        )
      )
      .then((result) => {
        if (result) {
          return res
            .status(200)
            .json({ message: altMessage || "record was deleted" });
        }
        return res
          .status(404)
          .json({ message: altMessage || "record was not deleted" });
      })
      .catch((error) => next(error));
  }
}

export default Controller;
