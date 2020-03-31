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
    this.postRecord = this.postRecord.bind(this);
    this.getSingleRecord = this.getSingleRecord.bind(this);
    this.getAllRecords = this.getAllRecords.bind(this);
    this.updateRecord = this.updateRecord.bind(this);
    this.deleteRecord = this.deleteRecord.bind(this);
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} res
   * @returns {obj} HTTP Response
   * @memberof Controller
   */
  postRecord(req, res) {
    return this.Model.create(req.body)
      .then(data => res.status(201).json({data}))
      .catch(error => res.status(400).json({message: error.message}));
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
  getAllRecords(
    req,
    res,
    options = {},
    scope = "defaultScope",
    {
      message = "no records available",
      acceptCallback = () => true,
      raw = false,
      statusCode = 200
    } = {}
  ) {
    let { offset = 0, limit = 8 } = req.query;

    limit = parseInt(limit, 10);
    offset = parseInt(offset, 10);
    options.limit = limit;
    options.offset = offset;
    return this.Model.scope(scope)
      .findAndCountAll(options)
      .then(result => {
        const { count, rows } = result;
        const pages = Math.ceil(count / limit);
        if (raw) return { limit, offset, pages, count, rows };
        if ((rows && rows.length) || acceptCallback(rows)) {
          return res.status(statusCode).json({
            data: { limit, offset, pages, count, rows }
          });
        }
        return res.status(404).json({message});
      })
      .catch(error => res.status(400).json({message: error.message}));
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} res
   * @returns {obj} Model
   * @memberof Controller
   */
  getSingleRecord(req, res, options = {}) {
    return this.Model.findByPk(req.params.id, options)
      .then(data => {
        if (!data) {
          return res.status(404).json("no records available");
        }
        return res.status(200).json({data});
      })
      .catch(error => res.status(400).json({message: error.message}));
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} res
   * @returns {obj} Model
   * @memberof Controller
   */
  updateRecord(req, res) {
    return this.Model.update(req.body, {
      where: {
        id: req.params.id
      },
      returning: true
    })
      .then(([count, [data]]) => {
        if (count > 0) {
          return res.status(200).json({data});
        }
        return res.status(404).json("no records available");
      })
      .catch(error => res.status(422).json({message: error.message}));
  }

  /**
   *
   *
   * @param {any} req
   * @param {any} res
   * @returns {obj} Model
   * @memberof Controller
   */
  deleteRecord(req, res) {
    return this.Model.destroy({
      where: { id: req.params.id }
    })
      .then(result => {
        if (result) {
          return this.getAllRecords(req, res);
        }
        return res.status(404).json("no records available");
      })
      .catch(error => res.status(400).json({message: error.message}));
  }
}

export default Controller;
