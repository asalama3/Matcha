import MongoConnect from '../mongo_connect';
import crypto from 'crypto';
var session = require('express-session');
// var ObjectID = require('mongodb').ObjectID;



const LoginUser =  (req, res) => {
  MongoConnect(res,  function (db){

    var hashPass = crypto.createHash('whirlpool').update(req.body.password).digest('base64');

    // console.log(req.session);
    // req.session.user = user;

    // console.log('session:', req.session);
    // console.log('id:', req._id.ObjectId);

    // console.log('user input pass:', hashPass);
    db.collection('users').findOne({username: req.body.username},  function (err, user){
      if (user)
      {
        // console.log("usrnm ok");
        if (user.password === hashPass)
        {
          var Id = user._id;

          req.session.user = {};
          req.session.user = user;
          console.log('hello', req.session);
          console.log('logged in');
          res.send({status: true, details: 'password ok in database'})
        }
        else{
          // console.log('database pass', requ.password);
          // console.log("password not ok");
          res.send({status: false, details: 'password not ok in database'})
        }
      }
      else{
        console.log("username not ok");
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
