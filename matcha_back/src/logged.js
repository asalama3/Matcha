import MongoConnect from '../mongo_connect';
var session = require('express-session');
import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectId;


const requireLogin = (req, res, next) =>
{
  console.log('session before changes : ', session.user);
    if (session.user)
    {
      MongoConnect(res,  function (db){
        db.collection('users').findOne({_id: ObjectId(session.user._id)}, function (err, user){
          if (err)
            res.send({status: false, details: "db error"});
          else if (!user)
            res.send({status: false, details: "no user found" });
          else{
            session.user = user;
            console.log('session right after changed' , session.user);
            res.send({status: true, details: 'ok logged in', data: session.user, username: session.user.username});
            return next(); 
          }
        })
      })
    }
    else
      res.send({status: false, details: 'not logged in'});
}


export {requireLogin};
