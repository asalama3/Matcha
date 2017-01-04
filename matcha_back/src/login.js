import crypto from 'crypto';
import mongoConnect from '../mongo_connect';

const jwt = require('jsonwebtoken');
// const session = require('express-session');

const LoginUser = (req, res) => {
  console.log('svvsv');
  mongoConnect(res, (db) => {
    const hashPass = crypto.createHash('whirlpool').update(req.body.password).digest('base64');
    db.collection('users').findOne({ username: req.body.username }, (err, user) => {
      if (user) {
        console.log('vrvfsdvsdvdsvsdvv');
        if (user.password === hashPass) {
          //session.user = user;
          const token = jwt.sign({
            username: user.username, id: user._id },
            'yay',
            { algorithm: 'RS256',
          });
          console.log(token);
          console.log('vrvfv');
          req.user = user;
          console.log(req.user);
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
