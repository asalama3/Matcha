var MongoConnect = require('../mongo_connect');

const createAccount = function (req, response) {
  console.log('salut');
  MongoConnect(response, function(db){
  console.log("hello");
  var user = { username: req.body.username, password: req.body.password, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email };

  db.collection('users').insert(user);
  // console.log(username);
  // console.log(request.body);
  // response.send({ status: false, details: 'user doesnt exist' });
})
};

const login = function (request, response) {
  console.log('salut');
};


module.exports = { createAccount, login };
