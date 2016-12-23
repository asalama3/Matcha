import MongoConnect from '../mongo_connect';
var session = require('express-session');
import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectId;


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
          db.collection('users').update({_id: ObjectId(user._id)}, {$pull: {interestedBy : session.user.username}  }, function (err, result){
            if (err)
            {
              console.log(err);
              res.send({status: false, details: "db error"});
            }else{
              db.collection('users').update({_id: ObjectId(session.user._id)}, {$pull: {interestedIn : req.body.username}  }, function (err, result){
                if (err)
                {
                  console.log(err);
                  res.send({status: false, details: "db error"});
                }else{
                  console.log("user was already liked, remove like")
                  res.send({status: true, details: "user already liked by loggedUser"});
                }
              })
            }
          })
        }
        else{
          console.log('user', user);
          let like = [];
          (user.interestedBy) ? like = user.interestedBy : like = [];
          like.push(session.user.username);
          console.log('like' , like);

          db.collection('users').update({_id: ObjectId(user._id)}, {$set: {interestedBy : like}  }, function (err, result){
            if (err)
            {
              console.log(err);
              res.send({status: false, details: "db error"});
            }else{
              let liked = [];
              (session.user.interestedIn) ? liked = session.user.interestedIn : liked = [];
              console.log('liked', liked);
              console.log('userrrrr', user);
              liked.push(user.username);
              db.collection('users').update({_id: ObjectId(session.user._id)}, {$set: {interestedIn : liked}  }, function (err, result){
                if (err)
                {
                  console.log(err);
                  res.send({status: false, details: "db error"});
                }else{
                  console.log("user is not liked, add like")
                  res.send({status: true, details: "user not liked yet by loggedUser"});
                }
              })
            }
          })
        }
      }
    })
  })
}

export {like};
