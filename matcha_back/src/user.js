import MongoConnect from '../mongo_connect';
import * as Account from './parser.js';
import crypto from 'crypto';
import mongodb from 'mongodb';
var session = require('express-session');


const createAccount = (req, res) => {
  MongoConnect(res, function(db){

  var hashPass = crypto.createHash('whirlpool').update(req.body.password).digest('base64');
  console.log(hashPass);

  var user = { username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, password: hashPass, gender: req.body.gender, orientation: req.body.orientation };
  var email = req.body.email;
  var password = req.body.password;


  db.collection('users').findOne({username: req.body.username}, function (err, user){
    console.log("collection db");
    if (err || user)
      return res.send({status: false, details: 'username already used'});
    else
    {
        db.collection('users').findOne({email: email}, function (err, usermail){
        if (err || usermail)
          return res.send({status: false, details: 'email already used'});
        else
        {
          console.log("tout est ok login ok");
          db.collection('users').insert(user, function (err){
            if (err)
              return res.send({status: false, details: 'db error'});
          });
          return res.send({status: true, details: 'registered'});
        }
      })
    }
  })
  console.log("form create");
})
};

const ObjectId = mongodb.ObjectId;

const LoginUser =  (req, res) => {
  console.log("login user")
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
        else{
          res.send({status: false, details: 'username or password invalid'})
      }}
      else
        res.send({status: false, details: 'username or password invalid'});
    })
  })
}


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




export {createAccount, LoginUser, autoFill};
