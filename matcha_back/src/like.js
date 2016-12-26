import MongoConnect from '../mongo_connect';
var session = require('express-session');
import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectId;


// const like = async(req, res) => {
//   MongoConnect(res,  function (db){
//     console.log("entered function like");
//     console.log('username' , req.body.username);

//     db.collection('users').findOne({ username: req.body.username }, function (err, user){
//       if (err)
//       {
//         res.send({status: false, details: "db error"});
//       }
//       else if (!user)
//       {
//         res.send({status: false, details: "no user found"});
//       }
//       else{
//         if (user.interestedBy.includes(session.user.username))
//         {
//           db.collection('users').update({_id: ObjectId(user._id)}, {$pull: {interestedBy : session.user.username}  }, function (err, result){
//             if (err)
//             {
//               console.log(err);
//               res.send({status: false, details: "db error"});
//             }else{
//               db.collection('users').update({_id: ObjectId(session.user._id)}, {$pull: {interestedIn : req.body.username}  }, function (err, result){
//                 if (err)
//                 {
//                   console.log(err);
//                   res.send({status: false, details: "db error"});
//                 }else{
//                   console.log("user was already liked, remove like")
//                   res.send({status: true, details: "user already liked by loggedUser"});
//                 }
//               })
//             }
//           })
//         }
//         else{
//           console.log('user', user);
//           let like = [];
//           (user.interestedBy) ? like = user.interestedBy : like = [];
//           like.push(session.user.username);
//           console.log('like' , like);

//           db.collection('users').update({_id: ObjectId(user._id)}, {$set: {interestedBy : like}  }, function (err, result){
//             if (err)
//             {
//               console.log(err);
//               res.send({status: false, details: "db error"});
//             }else{
//               let liked = [];
//               (session.user.interestedIn) ? liked = session.user.interestedIn : liked = [];
//               console.log('liked', liked);
//               console.log('userrrrr', user);
//               liked.push(user.username);
//               db.collection('users').update({_id: ObjectId(session.user._id)}, {$set: {interestedIn : liked}  }, function (err, result){
//                 if (err)
//                 {
//                   console.log(err);
//                   res.send({status: false, details: "db error"});
//                 }else{
//                   console.log("user is not liked, add like")
//                   res.send({status: true, details: "user not liked yet by loggedUser"});
//                 }
//               })
//             }
//           })
//         }
//       }
//     })
//   })
// }

const sendError = (res) => res.send({
  status: false,
  details: 'an error occurred',
})

const like = (req, res) => {
  const { username } = req.body
  MongoConnect(res, async (db) => {
    const users = db.collection('users')
    const liker = await users.findOne({ username: session.user.username })
    const liked = await users.findOne({ username })

    if (!liked) return res.send({ status: false, details: 'user not found' });
    if (liker.username === liked.username)
      res.send({ status: false, details: 'cannot like yourself'});
    console.log (liker.photo);
    if (liker.photo.length === 0) return res.send( {status: false, details: 'you need to add a picture to like' });
    // check block, photo, report...

    // already liked
    const alreadyLiked = liker.interestedIn.indexOf(liked.username) !== -1
    if (alreadyLiked) {
      users.update({ username: liker.username }, { $pull: { interestedIn: liked.username } },
        (err) => err ? sendError(res) : null)
      users.update({ username: liked.username }, { $pull: { interestedBy: liker.username } },
        (err) => err ? sendError(res) : null)
      res.send({ status: true, details: 'user successfully disliked' })      
    // not already liked
    } else {
      console.log('on va le like')
      users.update({ username: liker.username }, { $push: { interestedIn: liked.username } },
        (err) => err ? sendError(res) : null)      
      users.update({ username: liked.username }, { $push: { interestedBy: liker.username } },
        (err) => err ? sendError(res) : null)
      res.send({ status: true, details: 'user successfully liked' })      
    }
  });
}

export { like };
