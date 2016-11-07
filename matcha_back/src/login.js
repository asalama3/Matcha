import MongoConnect from '../mongo_connect';
import crypto from 'crypto';
var session = require('express-session');
// var ObjectID = require('mongodb').ObjectID;



const LoginUser = (req, res) => {
  MongoConnect(res, function(db){
    // console.log('sessionid:', req.session.id);
    // console.log('sessionID:', req.sessionID);


    var hashPass = crypto.createHash('whirlpool').update(req.body.password).digest('base64');
    // var sess = req.session;

    // var user = {};
    // req.session.user = {user_id: req._id.ObjectId};
    // req.session.user = user;

    // console.log('session:', req.session);
    // console.log('id:', req._id.ObjectId);

    console.log('user input pass:', hashPass);
    db.collection('users').findOne({username: req.body.username}, function (err, req){
      if (req)
      {
        console.log("usrnm ok");
        if (req.password === hashPass)
        {
          console.log("pass ok");
          // get_sess_id();
          // console.log(req.session);
          res.send({status: true, details: 'password ok in database'})
        }
        else{
          console.log('database pass', req.password);
          console.log("password not ok");
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
