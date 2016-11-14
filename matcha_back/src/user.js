import MongoConnect from '../mongo_connect';
import * as Account from './parser.js';
// var passwordHash = require('password-hash');
import crypto from 'crypto';


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


export {createAccount, login};
