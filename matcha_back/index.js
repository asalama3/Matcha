import express from 'express';
import mongodb from 'mongodb';
import mongoConnect from './mongo_connect';
import http from 'http';
import socketIO from 'socket.io';
import * as User from './src/user';
import * as Account from './src/parser';
import * as Logged from './src/logged';
// import * as Profile from './src/profile';
import * as Edit from './src/editProfile';
import * as Pic from './src/editPictures';
import * as profile from './src/search';
import * as like from './src/like';

const bodyParser = require('body-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const expressJwt = require('express-jwt');
const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

const users = [];

// lui envoyer au login l'id et le username pour generer le token;
// a insere dans le user.LoginUser pour generer un token;


// io.on('connection', (socket) => {
// 	if (!session.user) return false;
// 	users.push({ username: session.user.username, socket });
// });

app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
app.use(session({
		secret: 'ssshhhhh',
		resave: false,
		saveUninitialized: false,
		cookie: {},
	}));
app.use('/public', express.static(`${__dirname}/uploads/`));

app.use(expressJwt({
		secret: 'yay',
	}).unless({ path: './login' }));


/* replace function requireLogin to check le login */
/* req a remplace session */
const getToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }

app.use((req, res, next) => {
	console.log('app use');
	const token = getToken(req);
	jwt.verify(token, 'yay', async(err, decoded) => {
		if (err) {
			// handle errors
		} else {
			mongoConnect(res, (db) => {
				db.collection('users').findOne({ _id: objectId(decoded.id) }, (err, user) => {
					if (err) res.send({ status: false, details: 'db error' });
					else if (!user) res.send({ status: false, details: 'no user found' });
					else {
						const userWithPop = profile.popularity(user);
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
	})
});


app.post('/createaccount', Account.Username, Account.Firstname, Account.Lastname,
Account.Email, Account.Password, Account.Gender,
Account.Orientation, User.createAccount);
app.post('/login', User.LoginUser);
// app.post('/checklogin', Logged.requireLogin);
app.post('/editProfile', Account.Firstname, Account.Lastname, Account.Email, Edit.editProfile);
app.post('/autoFill', User.autoFill);
app.post('/editPic', Pic.addPic);
app.post('/logout', User.logout);
app.post('/searchLogin', User.searchLogin);
app.post('/deleteAccount', User.deleteAccount);
app.post('/search', profile.search);
app.post('/delPic', Pic.delPic);
app.post('/profilePic', Pic.profilePic);
app.post('/like', like.like(users));


// server.listen(8080);
app.listen(8080);
