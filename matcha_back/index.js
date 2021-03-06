import express from 'express';
import mongodb from 'mongodb';
import moment from 'moment';
import mongoConnect from './mongo_connect';
import http from 'http';
import socketIO from 'socket.io';
import * as User from './src/user';
import * as Account from './src/parser';
import * as Edit from './src/editProfile';
import * as Pic from './src/editPictures';
import * as Profile from './src/search';
import * as Suggestions from './src/suggestions';
import * as Like from './src/like';
import * as Pass from './src/forgotPassword';

const bodyParser = require('body-parser');
// const session = require('express-session');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const expressJwt = require('express-jwt');
const app = express();
const objectId = mongodb.ObjectId;

const server = http.createServer(app);
const io = socketIO(server);

const users = [];
const paths = ['/login', '/create_account', '/logout', '/forgot_password', '/reset_password'];

io.on('connection', (socket) => { // se connecte a un socket
  socket.on('auth', (token) => { // emet un evenement
    jwt.verify(token, 'yay', async(err, decoded) => {
      if (err) {
        // handle errors
        // return res.send({ status: false, details: 'cannot get authentification' });
      } else {
        mongoConnect(null, (db) => {
          const user = db.collection('users');
          user.update({ username: decoded.username }, { $set: { lastConnection: 'connected' } });
        });
        users.push({ username: decoded.username, socket });
        socket.username = decoded.username;
        // connect to bd add status online
      }
    });
  });
  socket.on('disconnect', () => {
    const { username } = socket;
    mongoConnect(null, (db) => {
      db.collection('users').findOne({ username }, (err, user) => {
        if (user) {
          db.collection('users').update({ username }, { $set: { lastConnection: moment().format('MMMM Do YYYY, h:mm:ss a') } });
        }
      });
    });
  });
  socket.on('new message', (data) => {
    mongoConnect(null, async (db) => {
      const { username } = socket;
      const chats = db.collection('chats');
      const chat = await chats.findOne({ $and: [
        { $or: [
          { 'userA.username': username },
          { 'userB.username': username },
          ] },
        { $or: [
          { 'userA.username': data.to },
          { 'userB.username': data.to },
          ] },
        ]
      });
      if (!chat) return (false);
      const message = {
        from: username,
        message: data.message,
      };
      const toSendMessage = users.filter(user => {
        return data.to === user.username
      }); // get all users connected and send them the mess
      if (toSendMessage && toSendMessage.length) {
        toSendMessage.forEach((user) => {
          user.socket.emit('receive new message', message);
        });
      }
      const user = db.collection('users');
      const notLoggedUser = await user.findOne({ username: data.to });
      const notifText = `${username} sent you a new message`;
      if (notLoggedUser) {
        const notif = notLoggedUser.notifications ? [...notLoggedUser.notifications, notifText] : [notifText];
        db.collection('users').update({ username: data.to }, { $set: { notifications: notif } });
        toSendMessage.forEach(el => el.socket.emit('notification', { notifText }));
        }
      await chats.update({ $or: [
        { 'userA.username': username, 'userB.username': data.to },
        { 'userB.username': username, 'userA.username': data.to },
      ] },
      { $push: { messages: message } }
    );
    });
  });
});

app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
app.use('/public', express.static(`${__dirname}/uploads/`));


/* replace function requireLogin to check le login */
/* req a remplace session */
const getToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  };

app.use((req, res, next) => {
	if (paths.includes(req.url)) {
		return next();
	}
	const token = getToken(req);
	jwt.verify(token, 'yay', async(err, decoded) => {
		if (err) {
			return res.send({ status: false, details: 'cannot get authentification' });
			// handle errors
		} else {
			mongoConnect(res, (db) => {
				db.collection('users').findOne({ _id: objectId(decoded.id) }, (error, user) => {
					if (error) res.send({ status: false, details: 'db error' });
					else if (!user) res.send({ status: false, details: 'no user found' });
					else {
						const userWithPop = Profile.popularity(user);
						req.user = userWithPop;
						// res.send({
						// 	status: true,
						// 	details: 'ok logged in',
						// 	data: req.user,
						// 	username: req.user.username,
						// });
						return next();
					}
					return false;
				});
			});
		}
	});
});

app.get('/my_profile', User.myProfile);
app.get('/fill_data', User.fillData);
app.get('/edit_pictures', User.editPictures);
app.get('/check_auth', User.checkAuth);
app.get('/get_matches', User.matches);

app.put('/block', User.block);

app.post('/create_account', Account.Username, Account.Firstname, Account.Lastname,
	Account.Email, Account.Password, Account.Gender,
	Account.Orientation, User.createAccount);
app.post('/login', Account.Username, Account.Password, User.LoginUser);
app.post('/editProfile', Account.Firstname, Account.Lastname, Account.Email, Account.Bio, Edit.editProfile);
app.post('/autoFill', User.autoFill);
app.post('/searchLogin', User.searchLogin(users));
app.post('/deleteAccount', User.deleteAccount);
app.post('/search', Profile.search);
app.post('/suggestions', Suggestions.suggestions);
app.post('/addPic', Pic.addPic);
app.post('/delPic', Pic.deletePic);
app.post('/profilePic', Pic.profilePic);
app.post('/like', Like.like(users));
app.post('/view_user', User.viewUser(users));
app.post('/search_by_tag', Profile.searchByTag);
app.post('/forgot_password', Pass.forgotPass);
app.post('/reset_password', Account.Password, Pass.resetPass);
app.post('/report', User.report);

const locas = [
  { lat: 48.854306, lng: 2.274548, address: '51 rue du Ranelagh, Paris, France' },
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
]

app.get('/updateLoca', (req, res) => {
    mongoConnect(res, (db) => {
      const users = db.collection('users');
      const all = users.find().toArray();
      all.forEach((user, id) => {
        users.update({ username: user.username }, { $set: locas[id] })
      });
    });
});
server.listen(8080);
