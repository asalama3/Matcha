import MongoConnect from '../mongo_connect';
var session = require('express-session');
import mongodb from 'mongodb';
import multer from 'multer';

const ObjectId = mongodb.ObjectId;


const addPic = (req, res) => {
      //  console.log(req.body);  // base64 img
      //  console.log(req.body.size);  // base64 img
      //  console.log(req.body.type);  // base64 img
     MongoConnect(res, function(db){
      if (!req.body.photo)
      {
        res.send({status: false, details: "empty photo"});
      }else{
        if (req.body.size < 1000000)
        {
          console.log("ok size");
          // res.send({status: false, details: "too large file"});
        }
        if (req.body.type === 'image/jpeg' || req.body.type === 'image/jpg' || req.body.type === 'image/png' || req.body.type === 'image/gif')
        {
          const photo = {photo: req.body.photo}
          db.collection('users').findOne({_id: ObjectId(session.user._id)}, function (err, user){
            if (err)
              res.send({status: false, details: "db error"});
            else if (!user)
              res.send({status: false, details: "no user found" });
            else{
              console.log("user found insert update his infos");
              db.collection('users').update({_id: ObjectId(session.user._id)}, {$set: photo}, function (err, result){
                if (err)
                  res.send({status: false, details: "db error"});
                else
                  res.send({status: true, details: "inserted photo ok"})
              }); 
            } 
        })
          // res.send({status: true, details: "extension valid"})
        }else{
          res.send({status: false, details: "wrong format"})
        }
      }
    })
 
}

export {addPic};