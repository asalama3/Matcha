import express from 'express';
import mongodb from 'mongodb';
import mongoConnect from './mongo_connect';
import http from 'http';
import socketIO from 'socket.io';
import * as User from './src/user';
import * as Account from './src/parser';
import * as Edit from './src/editProfile';
import * as Pic from './src/editPictures';
import * as Profile from './src/search';
import * as Like from './src/like';

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
const paths = ['/login', '/create_account', '/logout'];

io.on('connection', (socket) => {
  socket.on('auth', (token) => {
    // console.log('token: ' , token);
    jwt.verify(token, 'yay', async(err, decoded) => {
      // console.log('decoded: ', decoded.username);
      if (err) {
        // handle errors
        // return res.send({ status: false, details: 'cannot get authentification' });
      } else {
        users.push({ username: decoded.username, socket });
        // connect to bd add status online
      }
      // console.log(users);
    });
  });
  socket.on('disconnect', () => {
    mongoConnect(null, (db)) // connect add new date
  })
});

app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
app.use('/public', express.static(`${__dirname}/uploads/`));

// app.use(expressJwt({ secret: 'yay' }).unless({ path: paths }));

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

app.post('/create_account', Account.Username, Account.Firstname, Account.Lastname,
	Account.Email, Account.Password, Account.Gender,
	Account.Orientation, User.createAccount);
app.post('/login', Account.Username, Account.Password, User.LoginUser);
app.post('/editProfile', Account.Firstname, Account.Lastname, Account.Email, Edit.editProfile);
app.post('/autoFill', User.autoFill);
app.post('/searchLogin', User.searchLogin(users));
app.post('/deleteAccount', User.deleteAccount);
app.post('/search', Profile.search);
app.post('/addPic', Pic.addPic);
app.post('/delPic', Pic.deletePic);
app.post('/profilePic', Pic.profilePic);
app.post('/like', Like.like(users));
app.post('/view_user', User.viewUser(users));
app.post('/logout', User.logout);
server.listen(8080);
// app.listen(8080);
