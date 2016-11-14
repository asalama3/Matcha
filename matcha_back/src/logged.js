import MongoConnect from '../mongo_connect';
var session = require('express-session');


const requireLogin = (req, res, next) =>
{
  console.log('session : ', session.user);
    if (session.user)
    {
      res.send({status: true, details: 'ok lgged in'});
      return next();
    }
    else
      res.send({status: false, details: 'not logged in'});
}

export {requireLogin};
