import fs from 'fs';
import crypto from 'crypto';
import mongodb from 'mongodb';
import moment from 'moment';
import mongoConnect from '../mongo_connect';
import * as pop from './search';
// import mkdirp from 'mkdirp';
const session = require('express-session');
const jwt = require('jsonwebtoken');

const ageCalculated = (birthday) => {
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const createAccount = (req, res) => {
  mongoConnect(res, (db) => {
    const hashPass = crypto.createHash('whirlpool').update(req.body.password).digest('base64');
    const birthday = [req.body.year, req.body.month, req.body.day];
    const age = ageCalculated(new Date(birthday));
    const views = {
      number: 0,
      name: [],
    };
    const user = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashPass,
      age,
      day: req.body.day,
      month: req.body.month,
      year: req.body.year,
      gender: req.body.gender,
      orientation: req.body.orientation,
      location: req.body.position,
      photo: [],
      views };
    const email = req.body.email;
    // const password = req.body.password;
    db.collection('users').findOne({ username: req.body.username }, (err, username) => {
      if (err || username) return res.send({ status: false, details: 'username already used' });
      db.collection('users').findOne({ email }, (error, usermail) => {
        if (error || usermail) return res.send({ status: false, details: 'email already used' });
        const dir = `./uploads/${req.body.username}`;
        fs.mkdirSync(dir, (er) => {
          if (er) res.send({ status: false, details: 'error mkdirp' });
        });
        db.collection('users').insert(user, (e) => {
          if (e) return res.send({ status: false, details: 'db error' });
          console.log('new user registered' , user);
          return res.send({ status: true, details: 'registered' });
        });
      });
    });
  });
};

const objectId = mongodb.ObjectId;

const LoginUser = (req, res) => {
  const currentDate = new Date();
  console.log('date', currentDate);
  mongoConnect(res, (db) => {
    // console.log('body' , req.body);
    const hashPass = crypto.createHash('whirlpool').update(req.body.password).digest('base64');
    db.collection('users').findOne({ username: req.body.username }, (err, user) => {
      if (user) {
        if (user.password === hashPass) {
          // session.user = user;
          const token = jwt.sign({ username: user.username, id: user._id }, 'yay');
          req.user = user;
          console.log(token);
          res.header('Access-Control-Expose-Headers', 'x-access-token');
          res.set('x-access-token', token);
          res.send({ status: true, details: 'success' });
        } else {
          res.send({ status: false, details: 'username or password invalid' });
        }
      } else {
        res.send({ status: false, details: 'username or password invalid' });
      }
    });
  });
};

const autoFill = (req, res) => {
  mongoConnect(res, (db) => {
    db.collection('users').findOne({ _id: objectId(req.user._id) }, (err, user) => {
      if (err) {
        res.send({ status: false, details: 'no connexion to db' });
      } else if (!user) {
        res.send({ status: false, details: 'no user found' });
      } else {
        user.password = null;
        user._id = null;
        user.username = null;
        res.send({ status: true, details: 'all good', user });
      }
    });
  });
};

const searchLogin = (socketList) => (req, res) => {
  mongoConnect(res, (db) => {
    const users = db.collection('users');
    users.findOne({ username: req.body.username }, (err, user) => {
      if (user) {
        // console.log(req.user.blocked.indexOf(user.username));
        if (user.username.includes(req.user.blocked)) {
          console.log(req.user.blocked);
          return res.send({ status: false, details: 'user blocked' });
        }
        if (user.username === req.user.username) {
          return res.send({ status: false, details: 'cannot search yourself' });
        }
        if (user.views.name.indexOf(req.user.username) === -1) {
          user.views.number += 1;
          user.views.name.push(req.user.username);
          user = pop.popularity(user);
          users.update({ username: req.body.username }, { $set: { ...user } });
          const likerSocket = socketList.filter(el => el.username === user.username);
          if (likerSocket && likerSocket.length) { // keep message event if likerSocket is not online !!!
            const message = `${req.user.username} visited your profile`;
            likerSocket.forEach(el => el.socket.emit('notification', { message }));
            // const notif = user.notifications ? [...user.notifications, message] : [message];
            // users.update({ username: user.username }, { $set: { notifications: notif } });
          }
        }
        res.send({ status: true, details: 'username found', data: user, loggedUser: req.user });
      } else {
        res.send({ status: false, details: 'user not found' });
      }
    });
  });
};

const viewUser = (socketList) => (req, res) => {
  mongoConnect(res, (db) => {
    const users = db.collection('users');
    // console.log(req.body.username);
    users.findOne({ username: req.body.username }, (err, user) => {
      if (user) {
        if (user.views.name.indexOf(req.user.username) === -1) {
          user.views.number += 1;
          user.views.name.push(req.user.username);
          users.update({ username: req.body.username }, { $set: { ...user } });
          const likerSocket = socketList.filter(el => el.username === user.username);
          // console.log('likerSocket', likerSocket);
          const message = `${req.user.username} visited your profile`;
          // const notif = user.notifications ? [...user.notifications, message] : [message];
          if (likerSocket && likerSocket.length) {
            likerSocket.forEach(el => el.socket.emit('notification', { message }));
            // console.log('notif', notif);
          }
          // users.update({ username: user.username }, { $set: { notifications: notif } });
        }
        res.send({ status: true, details: 'user ok viewed' });
      } else {
        res.send({ status: false, details: 'user not found' });
      }
    });
  });
};

const deleteAccount = (req, res) => {
  mongoConnect(res, (db) => {
    db.collection('users').findOne({ _id: objectId(req.user._id) }, (err, user) => {
      if (err) {
        res.send({ status: false, details: 'no connexion to db' });
      } else if (!user) {
        res.send({ status: false, details: 'no user found' });
      } else {
        db.collection('users').remove({ _id: objectId(req.user._id) });
        fs.rmdir(`./uploads/${req.user.username}`, (error) => {
          if (error) return res.send({ status: false, details: 'error rmdir' });
          return res.send({ status: true, details: 'user deleted from db' });
        });
      }
    });
  });
};

// const logout = (req, res) => {
//   mongoConnect(res, (db) => {
//     const users = db.collection('users');
//     users.findOne({ username: req.body.username }, (err, user) => {
//       if (err) {
//         res.send({ status: false, details: 'no connection' });
//       } else if (!user) {
//         res.send({ status: false, details: 'no user found' });
//       } else {
//         // user.lastConnection = moment().format('MMMM Do YYYY, h:mm:ss a');
//         // console.log(user.lastConnection);
//         users.update({ username: req.body.username }, { $set: { ...user } });
//         res.send({ status: true, details: 'last connection added' });
//       }
//     });
//   });
// };

const myProfile = (req, res) => res.send({ status: true, data: req.user });

const fillData = (req, res) => res.send({ status: true });

const editPictures = (req, res) => res.send({ status: true, data: req.user });

const checkAuth = (req, res) => res.send({ status: true, data: req.user });

const matches = (req, res) => {
  mongoConnect(res, async (db) => {
    const data = await db.collection('chats').find({ $or: [
        { 'userA.username': req.user.username },
        { 'userB.username': req.user.username },
      ],
    }).toArray();
    res.send({ status: true, details: 'matches', data });
  });
};

const block = (req, res) => {
  console.log(req.user.username);
  console.log(req.body.username);
  mongoConnect(res, async (db) => {
    const users = await db.collection('users');
    const chats = await db.collection('chats');
    users.findOne({ username: req.body.username }, (err, user) => {
      if (user) {
        console.log('user found');
        if (user.views.name.indexOf(req.user.username)) {
          const del = user.views.name.indexOf(req.user.username);
          user.views.number -= 1;
          user.views.name.splice(del, 1);
          users.update({ username: req.body.username }, { $set: { ...user } } );
        }
      } else {
        console.log('user not found');
      }
    });
    users.findOne({ username: req.user.username }, (err, user) => {
      if (user) {
        console.log('user found');
        if (user.views.name.indexOf(req.body.username)) {
          const del = user.views.name.indexOf(req.body.username);
          user.views.number -= 1;
          user.views.name.splice(del, 1);
          users.update({ username: req.user.username }, { $set: { ...user } } );
        }
      } else {
        console.log('user not found');
      }
    });
    users.update({ username: req.user.username }, {
      $pull: {
        interestedIn: req.body.username,
        interestedBy: req.body.username
      },
      $push: {
        blocked: req.body.username,
      },
    });
    users.update({ username: req.body.username}, { $pull:
      { interestedIn: req.user.username,
        interestedBy: req.user.username },
    });
    console.log(req.user.username);
    console.log(req.body.username);
    chats.remove({ $or: [
       { 'userA.username': req.user.username, 'userB.username': req.body.username },
       { 'userA.username': req.body.username, 'userB.username': req.user.username },
     ],
   }, (err, result) => console.log(err ? 'err' : 'result'));
  });
}

export { createAccount, LoginUser, autoFill, searchLogin, viewUser, deleteAccount, myProfile, fillData, editPictures, checkAuth, matches, block };
