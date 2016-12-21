import MongoConnect from '../mongo_connect';
var session = require('express-session');
import mongodb from 'mongodb';


const like = async(req, res) => {
  MongoConnect(res,  function (db){
    console.log("entered function like");
    console.log('username' , req.body.username);

    db.collection('users').findOne({ username: req.body.username }, function (err, user){
      if (err)
      {
        res.send({status: false, details: "db error"});
      }
      else if (!user)
      {
        res.send({status: false, details: "no user found"});
      }
      else{
        if (user.interestedBy.includes(session.user.username))
        {
          console.log("user was already liked")          
          // remove from list interestesdby
          res.send({status: true, details: "user already liked by loggedUser"});
        }
        else{
          console.log("user is not liked")
          // add to list interestedby
          res.send({status: true, details: "user not liked yet by loggedUser"});
        }
      }

    })
  })
}

export {like};
