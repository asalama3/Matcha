import MongoConnect from '../mongo_connect';
import * as Account from './parser.js';
import crypto from 'crypto';
import mongodb from 'mongodb';
// import mkdirp from 'mkdirp';
import fs from 'fs';
var session = require('express-session');


const age_calculated = (birthday) => { 
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const createAccount = (req, res) => {
  MongoConnect(res, function(db){

  var hashPass = crypto.createHash('whirlpool').update(req.body.password).digest('base64');
  console.log(hashPass);

  console.log(req.body);
  var birthday = [req.body.year, req.body.month , req.body.day];
  var age = age_calculated(new Date(birthday));

  var user = { username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, password: hashPass, age: age, day: req.body.day, month: req.body.month, year: req.body.year, gender: req.body.gender, orientation: req.body.orientation };
  var email = req.body.email;
  var password = req.body.password;


  db.collection('users').findOne({username: req.body.username}, (err, username) => {
    if (err || username)
      return res.send({status: false, details: 'username already used'});
    else
    {
        db.collection('users').findOne({email: email}, function (err, usermail){
        if (err || usermail)
          return res.send({status: false, details: 'email already used'});
        else
        {
          var dir = './uploads/'+req.body.username;
          fs.mkdirSync(dir, function(err){
            if (err)
              {
                console.log("error mkdirp");
                res.send({status: false, details: "error mkdirp"});
              }
            })
          db.collection('users').insert(user, (err) =>{
            if (err)
              return res.send({status: false, details: "db error"})
            else
              return res.send({status: true, details: "registered"});
            });
          }
        })
      }
    })
  })
};

const ObjectId = mongodb.ObjectId;

const LoginUser =  (req, res) => {
  // console.log("login user")
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
  // console.log("autofill");
  // console.log(session.user._id);

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
