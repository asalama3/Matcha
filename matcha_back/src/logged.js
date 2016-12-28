import mongodb from 'mongodb';
import mongoConnect from '../mongo_connect';
import * as pop from './search';

const objectId = mongodb.ObjectId;

const session = require('express-session');


const requireLogin = (req, res, next) => {
  if (session.user) {
    mongoConnect(res, (db) => {
      db.collection('users').findOne({ _id: objectId(session.user._id) }, (err, user) => {
        if (err) res.send({ status: false, details: 'db error' });
        else if (!user) res.send({ status: false, details: 'no user found' });
        else {
          const popUser = pop.popularity(user);
          session.user = popUser;
          res.send({ status: true, details: 'ok logged in', data: session.user, username: session.user.username });
          return next();
        }
        return false;
      });
    });
  } else {
    res.send({ status: false, details: 'not logged in' });
  }
};


export { requireLogin };
