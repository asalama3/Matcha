import express from 'express';
// var express = require('express');
import * as User from './src/user';
import * as Account from './src/parser'
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var MongoClient = require('./mongo_connect');
import * as Login from './src/login';
var session = require('express-session');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))


// app.post('/createaccount', User.login);
app.post('/createaccount', Account.Username, Account.Firstname, Account.Lastname,
                          Account.Email, Account.Password, User.createAccount);

app.post('/login', Account.Username, Account.Password, Login.LoginUser);
// app.post('/createaccount', User.createAccount);

app.listen(8080);
