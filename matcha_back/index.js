import express from 'express';
import * as User from './src/user';
import * as Account from './src/parser';
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var MongoClient = require('./mongo_connect');
// import * as Login from './src/login';
var session = require('express-session');
import * as Logged from './src/logged';
import * as Profile from './src/profile';
import * as Edit from './src/editProfile';
import * as Pic from './src/editPictures';

app.use(cors());
app.use(bodyParser.json({limit: '2mb'}));
app.use(bodyParser.urlencoded({limit: '2mb',  extended: true }));
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {secureProxy: true,
// }
// }))

app.use(session({
		secret: 'ssshhhhh',
		resave: false,
		saveUninitialized: false,
	}));
app.use("/public", express.static(__dirname + "/uploads/"));



// app.post('/createaccount', User.login);
app.post('/createaccount', Account.Username, Account.Firstname, Account.Lastname,
                          Account.Email, Account.Password, Account.Gender, Account.Orientation, User.createAccount);

app.post('/login', Account.Username, Account.Password, User.LoginUser);

app.post('/checklogin', Logged.requireLogin);
app.post('/editProfile', Account.Firstname, Account.Lastname, Account.Email, Edit.editProfile);
app.post('/autoFill', User.autoFill);
app.post('/editPic', Pic.addPic);
app.post('/logout', User.logout);
app.post('/searchLogin', User.searchLogin);
app.post('/deleteAccount', User.deleteAccount);


app.listen(8080);
