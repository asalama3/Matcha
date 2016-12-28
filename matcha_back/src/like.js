import mongodb from 'mongodb';
import mongoConnect from '../mongo_connect';

const session = require('express-session');

// const sendError = (res) => res.send({
//   status: false,
//   details: 'an error occurred',
// });

const like = (req, res) => {
  const { username } = req.body;
  mongoConnect(res, async (db) => {
    const users = db.collection('users');
    const liker = await users.findOne({ username: session.user.username });
    const liked = await users.findOne({ username });
    if (!liked) return res.send({ status: false, details: 'user not found' });
    if (liker.username === liked.username) return res.send({ status: false, details: 'cannot like yourself' });
    if (liker.photo.length === 0) return res.send({ status: false, details: 'you need to add a picture to like' });
    // check block, photo, report...

    // already liked
    const alreadyLiked = liker.interestedIn.indexOf(liked.username) !== -1;
    if (alreadyLiked) {
      users.update({ username: liker.username }, { $pull: { interestedIn: liked.username } });
      users.update({ username: liked.username }, { $pull: { interestedBy: liker.username } });
      res.send({ status: true, details: 'user successfully disliked' });
    // not already liked
    } else {
      users.update({ username: liker.username }, { $push: { interestedIn: liked.username } });
      users.update({ username: liked.username }, { $push: { interestedBy: liker.username } });
      res.send({ status: true, details: 'user successfully liked' });
    }
    return false;
  });
};

export { like };
