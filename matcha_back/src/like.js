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
    // check block, photo, report...

    // already liked
    const alreadyLiked = liker.interestedIn.indexOf(liked.username) !== -1;
    if (alreadyLiked) {
      users.update({ username: liker.username }, { $pull: { interestedIn: liked.username } });
      users.update({ username: liked.username }, { $pull: { interestedBy: liker.username } });
      res.send({ status: true, details: 'user successfully disliked' });
    // not already liked
    } else {
      const likerSocket = socketList.filter(el => el.username === liked.username);
      console.log('liked user', liked.username);
      const message = `${liker.username} liked your profile `;
      console.log('liker socket', likerSocket);
      if (likerSocket && likerSocket.length) {
        likerSocket.forEach(el => el.socket.emit('notification', { message: `${liker.username} liked your profile ` }));
      }
      console.log('notif', liked.notifications);
      const notif = liked.notifications ? [...liked.notifications, message] : [message];
      console.log(notif);
      users.update({ username: liked.username }, { $set: { notifications: notif } });
      users.update({ username: liker.username }, { $push: { interestedIn: liked.username } });
      users.update({ username: liked.username }, { $push: { interestedBy: liker.username } });
      res.send({ status: true, details: 'user successfully liked' });
      console.log('liked', liked);
    }
    return false;
  });
};

export { like };
