import crypto from 'crypto';
import mongoConnect from '../mongo_connect';

const session = require('express-session');

const LoginUser = (req, res) => {
  mongoConnect(res, (db) => {
    const hashPass = crypto.createHash('whirlpool').update(req.body.password).digest('base64');
    db.collection('users').findOne({ username: req.body.username }, (err, user) => {
      if (user) {
        if (user.password === hashPass) {
          session.user = user;
          res.send({ status: true, details: 'success' });
        } else {
          res.send({ status: false, details: 'username or password invalid' });
        }
      } else {
        res.send({ status: false, details: 'username or password invalid' });
      }
    });
  });
};

export { LoginUser };
