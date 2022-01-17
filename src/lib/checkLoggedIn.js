const checkLoggedIn = (req, res, next) => {
  if (!req.app.locals.user) {
    res.sendStatus(401);
    return;
  }
  return next();
};

export default checkLoggedIn;
