const wrapAsync = (fn) => {
  return (err, req, res, next) => {
    fn(err, req, res, next).catch(next(err));
  };
};

module.exports = wrapAsync;
