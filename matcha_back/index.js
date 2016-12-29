import express from 'express';
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
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const users = [];

io.on('connection', (socket) => {
	if (!session.user) return false;
	users.push({ username: session.user.username, socket });
});

app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
app.use(session({
		secret: 'ssshhhhh',
		resave: false,
		saveUninitialized: false,
	}));
app.use('/public', express.static(`${__dirname}/uploads/`));
app.post('/createaccount', Account.Username, Account.Firstname, Account.Lastname,
Account.Email, Account.Password, Account.Gender,
Account.Orientation, User.createAccount);
app.post('/login', Account.Username, Account.Password, User.LoginUser);
app.post('/checklogin', Logged.requireLogin);
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


server.listen(8080);
