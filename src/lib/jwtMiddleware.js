import jwt from 'jsonwebtoken';
import User from '../models/user';

const jwtMiddleware = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.app.locals.user = {
      _id: decoded._id,
      username: decoded.username,
    };

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
      User.findById(decoded._id).then(user => {
        const token = user.generateToken();
        res.cookie('access_token', token, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true,
        });
        return next();
      });
    } else {
      return next();
    }
  } catch (e) {
    return next();
  }
};

export default jwtMiddleware;
