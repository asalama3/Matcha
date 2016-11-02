import MongoConnect from '../mongo_connect';
import * as Account from './parser.js';

// const checkLogin = (username, password) => {
//
// }

const createAccount = (req, res) => {
  console.log('salut');
  MongoConnect(res, function(db){
  console.log("hello");
  var user = { username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, password: req.body.password };
  // var email = req.body.email;
  console.log('username:', req.body.username);
  console.log('username:', req.body.email);

  // const alreadyUsername = db.collection('users').findOne({ req.body.username });
  // const alreadyMail = db.c....
  db.collection('users').findOne({username: req.body.username}, function (err, req){
    if (err || req)
    {
      console.log("noooooot ok");
      return res.send({status: false, details: 'username already used'});
    }
    else
    // const resultat = checkLogin(username, password);
    // if (resultat === 1)
    {
        db.collection('users').findOne({email: user.email}, function (err, req){
        if (err || req)
        {
          console.log("email used");
          return res.send({status: false, details: 'email already used'});
        }
        else
        {
          console.log("ok email");
          db.collection('users').insert(user);
          return res.send({status: true, details: 'registered'});
        }
      })
    }
  })

  // console.log('error:' + err);
  // console.log('request:' + req);


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

  console.log(req.body);
})
};

const login = (request, response) => {
  console.log('saluttttttt');
};


export {createAccount, login};
