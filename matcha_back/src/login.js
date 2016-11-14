import MongoConnect from '../mongo_connect';
import crypto from 'crypto';
var session = require('express-session');
// var ObjectID = require('mongodb').ObjectID;

const LoginUser =  (req, res) => {
  MongoConnect(res,  function (db){

    var hashPass = crypto.createHash('whirlpool').update(req.body.password).digest('base64');
    db.collection('users').findOne({username: req.body.username},  function (err, user){
      if (user)
      {
        if (user.password === hashPass)
        {
          session.user = user;
          res.send({status: true, details: 'success'})
        }
        else
          res.send({status: false, details: 'username or password invalid'})
      }
      else
        res.send({status: false, details: 'username or password invalid'});
    })
  })
}

// const LoginUser = (req, res) => {
//   MongoConnect(res, async (db) => {
//     const { username, password } = req.body;
//     const users = db.collection('users');
//     const data = {
//       username,
//       password: crypto.createHash('whirlpool').update(req.body.password).digest('base64'),
//     }
//     const alreadyExist = await users.findOne({ username: data.username, password: data.password });
//     if (!alreadyExist) return res.send({ status: false, details: 'username or password invalid' });
//     return res.send({ status: true, details: ' success' });
//   });
// };

export {LoginUser};
