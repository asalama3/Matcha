import MongoConnect from '../mongo_connect';
import * as Account from './parser.js';
// var passwordHash = require('password-hash');
import crypto from 'crypto';
import mongodb from 'mongodb';
var session = require('express-session');

const ObjectId = mongodb.ObjectId;

const createAccount = (req, res) => {
  MongoConnect(res, function(db){

  // var hashedPassword = passwordHash.generate(req.body.password);
  var hashPass = crypto.createHash('whirlpool').update(req.body.password).digest('base64');
  console.log(hashPass);

  var user = { username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, password: hashPass };
  var email = req.body.email;
  var password = req.body.password;


  db.collection('users').findOne({username: req.body.username}, function (err, user){
    if (err || user)
      return res.send({status: false, details: 'username already used'});
    else
    {
        db.collection('users').findOne({email: email}, function (err, usermail){
        if (err || usermail)
          return res.send({status: false, details: 'email already used'});
        else
        {
          db.collection('users').insert(user);
          return res.send({status: true, details: 'registered'});
        }
      })
    }
  })
  console.log(req.body);


  // db.collection('user').findOne(req.body.email);
  // console.log(UsedUsername);
//   if (UsedUsername)
//   {
//     console.log("username already used");
//     res.send({status: false, details: 'username already used'});
//   }
//
//   else if (UsedEmail)
//   {
//     console.log("email already used");
//     res.send({status: false, details: 'email already used'});
//   }
//   else{
//
//   db.collection('users').insert(user);
//   res.send({status: true, details: 'registered'});
// }

  // Account.Username(user);

})
};

const login = (request, response) => {
  console.log('saluttttttt');
};


const logout = (req, res) => {
  session.destroy(user);
  res.send({status: true, details: 'logout'});
}


const autoFill = (req, res) => {
  console.log("autofill");
  console.log(session.user._id);

  MongoConnect(res, function (db) {    
    db.collection('users').findOne({ _id: ObjectId(session.user._id) }, function (err, user) {
      if (err) {
        res.send({ status: false, details: "no connexion to db" });
      }
      else if (!user) {
        res.send({ status: false, details: "no user found" });
      }
      else {
        user.password = null;
        user._id = null;
        user.username = null;
        res.send({ status: true, details: "all good", user: user });
      }
    })
  })
};




export {createAccount, login, autoFill};
