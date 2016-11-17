import express from 'express';
// var express = require('express');
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

// var store = express.session.MemoryStore;
// var sessionStore = new MemoryStore();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // store: sessionStore,
  cookie: {secureProxy: true,
}
}))


// app.post('/createaccount', User.login);
app.post('/createaccount', Account.Username, Account.Firstname, Account.Lastname,
                          Account.Email, Account.Password, Account.Gender, Account.Orientation, User.createAccount);

app.post('/login', Account.Username, Account.Password, User.LoginUser);

app.post('/checklogin', Logged.requireLogin);
app.post('/editProfile', Account.Firstname, Account.Lastname, Account.Email, Edit.editProfile);
app.post('/autoFill', User.autoFill);
app.listen(8080);
