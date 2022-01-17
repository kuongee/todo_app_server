import Joi from 'joi';
import User from '../../models/user';

export const register = (req, res) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.sendStatus(400);
    return;
  }

  const { username, password } = req.body;
  User.findByUsername(username)
    .then(exists => {
      if (exists) {
        res.sendStatus(409);
        return;
      }

      const user = new User({
        username,
      });

      user.setPassword(password).then(() => {
        user.save().then(() => {
          const token = user.generateToken();
          res.cookie('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
          });

          res.send(user.serialize());
        });
      });
    })
    .catch(e => {
      res.sendStatus(500);
    });
};

export const login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.sendStatus(401);
    return;
  }
  User.findByUsername(username)
    .then(user => {
      if (!user) {
        res.sendStatus(401);
        return;
      }

      user.checkPassword(password).then(valid => {
        if (!valid) {
          res.sendStatus(401);
          return;
        }

        const token = user.generateToken();
        res.cookie('access_token', token, {
          maxAge: 1000 * 60 * 60 * 24 * 7,
          httpOnly: true,
        });
        res.send(user.serialize());
      });
    })
    .catch(e => {
      res.sendStatus(500);
    });
};

export const check = (req, res) => {
  const { user } = req.app.locals;
  if (!user) {
    res.sendStatus(401);
    return;
  }

  res.send(user);
};

export const logout = (req, res) => {
  res.cookie('access_token', '');
  res.sendStatus(204);
};
