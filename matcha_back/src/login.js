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
          // create token, save into database , send to front to localstorage.

          console.log('at login:', req.session);

          res.send({status: true, details: 'password ok in database'})
        }
        else{
          res.send({status: false, details: 'password not ok in database'})
        }
      }
      else{
        res.send({status: false, details: 'username not found in database'});
      }
    })
  })
}

// const get_sess_id = (req, res) =>{
  // var user = {};
  // req.session.user = {user_id: req._id};
  // req.session.user = user;

// }
export  {LoginUser};
