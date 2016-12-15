import MongoConnect from '../mongo_connect';
var session = require('express-session');
import mongodb from 'mongodb';
import fs from 'fs';
// import mkdirp from 'mkdirp';

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
        }
        if (req.body.type === 'image/jpeg' || req.body.type === 'image/jpg' || req.body.type === 'image/png' || req.body.type === 'image/gif')
        {
          // const photo = {photo: req.body.name}

          db.collection('users').findOne({_id: ObjectId(session.user._id)}, function (err, user){
            console.log('photo number', user.photo.length);
            if (err)
              return res.send({status: false, details: "db error"});
            else if (!user)
              return res.send({status: false, details: "no user found" });
            else if (user.photo.length === 5)
              return res.send({status: false, details: "too many images" });
            else{
                var matches = req.body.photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                // console.log(matches);

                if (matches.length !== 3) {
                  res.send({status: false, details: "invalid input string"}); 
                }

                // response.type = matches[1];
                var imageBuffer = new Buffer(matches[2], 'base64');

                console.log(imageBuffer);

                fs.writeFile('./uploads/'+ session.user.username+'/'+req.body.name, imageBuffer, function(err) { 
                  if (err){ 
                    console.log("fais chier");
                    res.send({status: false, details: "invalid input string"});
                  }
                 });


                 if (user.photo){
                   console.log("photo exists");
                   var photo = user.photo;
                 }
                 else{
                   console.log("doesnt' exist");                   
                   var photo = [];
                 } 
                photo.push({name:req.body.name, profil:false});

                console.log("log photo", photo);


              console.log("user found insert update his infos");
              db.collection('users').update({_id: ObjectId(session.user._id)}, {$set: {photo:photo}}, function (err, result){
                if (err){
                  console.log(err);
                  res.send({status: false, details: "db error"});
                }
                else{
                  // console.log('result' , result);
                  console.log('photo' , photo);
                  res.send({status: true, details: "inserted photo ok", data: photo})
                }  
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

const delPic = (req, res) => {
  MongoConnect(res, function(db){
  
  console.log("ok delpic");
  console.log(req.body.name);

  fs.unlink('./uploads/'+ session.user.username+'/'+req.body.name, (err) => {
    if (err) throw err;
  console.log('successfully deleted picture');
  });

  db.collection('users').update({_id: ObjectId(session.user._id)}, {$pull: {photo : { name: req.body.name} } }, function (err, result){
    if (err)
    {
      console.log(err);
      res.send({status: false, details: "db error"});
    }else{
      db.collection('users').findOne({_id: ObjectId(session.user._id)}, function (err, user){
        if (err)
          return res.send({status: false, details: "db error"});
        if (user)
        {
          console.log("ok photo del");
          console.log("rrrrrrrrrrrr", user.photo);
          var newPhotoArray = user.photo;
          res.send({status: true, details: "deleted photo ok", values: newPhotoArray});
        }
      })
    }
  })
  
});
}

const profilePic = (req, res) => {
  console.log("entered profile pic");
//   console.log(req.body.name);
//   MongoConnect(res, function(db){
//     db.collection('users').update({_id: ObjectId(session.user._id)}, {$set: {photo: {profile: true} } }, function (err, result){
//       if (err)
//       {
//         console.log(err);
//         res.send({status: false, details: "db error"});
//       }
//       else{
//         console.log("ok updated");
//         return res.send ({status: true, details: "success"});
//       }
//     })
//   });  
}

export {addPic, delPic, profilePic};