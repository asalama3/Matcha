import MongoConnect from '../mongo_connect';
var session = require('express-session');


const requireLogin = (req, res, next) =>
{
    if (req.session.user)
    {
      res.send({status: true, details: 'ok lgged in'});
      return next();
    }
    else
    {
      res.send({status: false, details: 'not logged in'});
      // res.redirect('/');
    }
}

export {requireLogin};
