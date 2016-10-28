var express = require('express');
var User = require('./src/user');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var MongoClient = require('./mongo_connect');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/createaccount', User.createAccount);

app.listen(8080);
