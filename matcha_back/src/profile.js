import MongoConnect from '../mongo_connect';
// var session = require('express-session');


const requireLogin = (req, res) =>{
  console.log('back', req.session.user);

if (req.user)
{
  res.send({status: true, details: 'ok lgged in'});
}
else{
  // console.log(req.session.user);
  res.send({status: false, details: 'not logged in'});
}
}

export {requireLogin};
