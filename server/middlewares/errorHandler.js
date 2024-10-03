const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.name === "SequelizeValidationError") {
    errors = err.errors.map((el) => {
      return el.message;
    });
    res.status(400).json({
      error: true,
      msg: errors
    });
  } else if (err.name === "SequelizeUniqueConstraintError") {
    errors = err.errors.map((el) => {
      return el.message;
    });
    res.status(400).json({
      error: true,
      msg: errors
    });
  } else if (err.name === "not_found") {
    res.status(err.code).json({
      error: true,
      msg: err.msg
    });
  } else if (err.name === "Unauthorized") {
    res.status(err.code).json({
      error: true,
      msg: err.msg
    })
  } else if (err.name === "login_auth") {
    res.status(err.code).json({
      error: true,
      msg: err.msg
    })
  } else if (err.name === "forbidden") {
    res.status(err.code).json({
      error: true,
      msg: err.msg
    })
  } else if (err.name === "JsonWebTokenError") {
    res.status(401).json(err.message)
  } else if (err.name === "invalid") {
    res.status(err.code).json({
      error: true,
      msg: err.msg
    })
  }
  else if (err.name === "insufficient_stock") {
    res.status(err.code).json({
      error: true,
      msg: err.msg
    })
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = errorHandler;