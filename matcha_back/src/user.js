import MongoConnect from '../mongo_connect';
import * as Account from './parser.js';

const createAccount = (req, response) => {
  console.log('salut');
  MongoConnect(response, function(db){
  console.log("hello");
  var user = { username: req.body.username, password: req.body.password, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email };


    db.collection('users').insert(user);
    // response.send({status: true, details: 'registered'});


  // Account.Username(user);

  console.log(req.body);
  response.send({ status: false, details: 'user doesnt exist' });
})
};

const login = (request, response) => {
  console.log('saluttttttt');
};


export {createAccount, login};
