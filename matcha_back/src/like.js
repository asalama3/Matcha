import mongodb from 'mongodb';
import mongoConnect from '../mongo_connect';

// const session = require('express-session');

// const sendError = (res) => res.send({
//   status: false,
//   details: 'an error occurred',
// });

const like = (socketList) => (req, res) => {
  const { username } = req.body;
  mongoConnect(res, async (db) => {
    const users = db.collection('users');
    const liker = await users.findOne({ username: req.user.username });
    const liked = await users.findOne({ username });
    if (!liked) return res.send({ status: false, details: 'user not found' });
    if (liker.username === liked.username) return res.send({ status: false, details: 'cannot like yourself' });
    if (liker.photo.length === 0) return res.send({ status: false, details: 'you need to add a picture to like' });
    // check block, report...

    // already liked
    const alreadyLiked = liker.interestedIn.indexOf(liked.username) !== -1;
    if (alreadyLiked) {
      if (liked.match.includes(liker.username) && (liker.match.includes(liked.username))) {
        users.update({ username: liker.username }, { $pull: { match: liked.username } });
        users.update({ username: liked.username }, { $pull: { match: liker.username } });
        // remove chat
      }
      users.update({ username: liker.username }, { $pull: { interestedIn: liked.username } });
      users.update({ username: liked.username }, { $pull: { interestedBy: liker.username } });
      res.send({ status: true, details: 'user successfully disliked' });
    // not already liked
    } else {
      const likerSocket = socketList.filter(el => el.username === liked.username);
      if (likerSocket && likerSocket.length && !liked.interestedIn.includes(liker.username)) {
        const message = `${liker.username} liked your profile `;
        likerSocket.forEach(el => el.socket.emit('notification', { message }));
        const notif = liked.notifications ? [...liked.notifications, message] : [message];
        users.update({ username: liked.username }, { $set: { notifications: notif } });
      } else {
        const message = `${liker.username} liked your profile and it's a match! `;
        likerSocket.forEach(el => el.socket.emit('notification', { message }));
        const notif = liked.notifications ? [...liked.notifications, message] : [message];
        const likedMatch = liked.match ? [...liked.match, liker.username] : [liker.username];
        const likerMatch = liker.match ? [...liker.match, liked.username] : [liked.username];
        users.update({ username: liked.username }, { $set: { notifications: notif, match: likedMatch } });
        users.update({ username: liker.username }, { $set: { match: likerMatch } });
      }
      users.update({ username: liker.username }, { $push: { interestedIn: liked.username } });
      users.update({ username: liked.username }, { $push: { interestedBy: liker.username } });
      res.send({ status: true, details: 'user successfully liked' });
    }
    return false;
  });
};

export { like };
