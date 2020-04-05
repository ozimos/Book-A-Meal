const validationErrors = (err, req, res, next) => {
  if (err.error && err.error.isJoi) {
    const message = {};
    err.error.details.forEach(elem => {
      message[elem.path[0]] = elem.message;
    });
    res.status(400).json({
      message
    });
  } else next(err);
};

export default validationErrors;
