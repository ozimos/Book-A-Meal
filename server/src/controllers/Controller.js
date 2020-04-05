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
    this.statusCode = 200;
    this.message = "";
    this.Model = Model;
    this.scope = "defaultScope";
    this.options = {};
    this.postRecord = this.postRecord.bind(this);
    this.getSingleRecord = this.getSingleRecord.bind(this);
    this.getAllRecords = this.getAllRecords.bind(this);
    this.updateRecord = this.updateRecord.bind(this);
    this.deleteRecord = this.deleteRecord.bind(this);
  }

  /**
   *
   *
   * @param {any} row
   * @returns {obj}
   * @memberof Controller
   */
  transformer(row) {
    return row;
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
    return this.Model.create(req.body)
      .then(data => res.status(201).json({ data }))
      .catch(error => next(error));
  }

  /**
   *
   *
   * @param {any} req express object
   * @param {any} res express object
   * @param {any} scope sequelize scope object
   * @param {any} options sequelize options object
   * @param {string} message error message
   * @param {function} acceptCallback error decision callback
   * @param {boolean} raw return raw results
   * @returns {obj} Model
   * @memberof Controller
   */
  getAllRecords(req, res, next) {
    let { offset = 0, limit = 8 } = req.query;

    return this.Model.scope(this.scope)
      .findAndCountAll({ ...this.options, limit, offset })
      .then(result => {
        const { count, rows } = result;
        const pages = Math.ceil(count / limit);
        if (rows.length) {
          return res.status(this.statusCode).json({
            data: { limit, offset, pages, count, rows }
          });
        }
        const message = this.message || "no records available";
        return res.status(404).json({ message });
      })
      .catch(error => next(error));
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
    return this.Model.findByPk(req.params.id, this.options)
      .then(data => {
        if (!data) {
          const message = this.message || "no records available";
          return res.status(404).json({ message });
        }
        return res.status(200).json({ data });
      })
      .catch(error => next(error));
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
    return this.Model.update(req.body, {
      where: {
        id: req.params.id
      },
      returning: true
    })
      .then(([count, [data]]) => {
        if (count > 0) {
          return res.status(200).json({ data });
        }
        const message = this.message || "no records available";
        return res.status(404).json({ message });
      })
      .catch(error => next(error));
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
    return this.Model.destroy({
      ...this.options,
      where: { id: req.params.id }
    })
      .then(result => {
        if (result) {
          return res.status(200).json({ message: "record was deleted" });
        }
        return res.status(404).json({ message: "record was not deleted" });
      })
      .catch(error => next(error));
  }
}

export default Controller;
