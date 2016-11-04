// var MongoClient = require('../mongo_connect');
import MongoConnect from '../mongo_connect';
// var passwordHash = require('password-hash');
import crypto from 'crypto';


const LoginUser = (req, res) => {
  MongoConnect(res, function(db){
    // var hashedPassword = passwordHash.generate(req.body.password);
    var hashPass = crypto.createHash('whirlpool').update(req.body.password).digest('base64');

    console.log('user input pass:', hashPass);
    db.collection('users').findOne({username: req.body.username}, function (err, req){
      if (req)
      {
        console.log("usrnm ok");
        if (req.password === hashPass)
        {
          console.log("pass ok");
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
// res.send({status: true, details: 'test'})
}

export  {LoginUser};
