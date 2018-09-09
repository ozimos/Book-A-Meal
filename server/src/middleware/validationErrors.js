const validationErrors = (err, req, res, next) => {

  if (err.error && err.error.isJoi) {
    const key = err.error.details[0].path[0];
    res.status(400).json({
      message: { [key]: err.error.details[0].message }
    });
  } else next(err);
};

export default validationErrors;
