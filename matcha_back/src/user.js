import fs from 'fs';
import crypto from 'crypto';
import mongodb from 'mongodb';
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

const searchLogin = (req, res) => {
  mongoConnect(res, (db) => {
    const users = db.collection('users');
    users.findOne({ username: req.body.username }, (err, user) => {
      if (user) {
        if (user.views.name.indexOf(req.user.username) === -1) {
          user.views.number += 1;
          user.views.name.push(req.user.username);
          user = pop.popularity(user);
          users.update({ username: req.body.username }, { $set: { ...user } });
        }
        res.send({ status: true, details: 'username found', data: user, loggedUser: req.user });
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
          if (error) res.send({ status: false, details: 'error rmdir' });
        });
        res.send({ status: true, details: 'user deleted from db' });
      }
    });
  });
};

const myProfile = (req, res) => res.send({ status: true, data: req.user });

const fillData = (req, res) => res.send({ status: true });

const editPictures = (req, res) => res.send({ status: true, data: req.user });

const checkAuth = (req, res) => res.send({ status: true, data: req.user });

export { createAccount, LoginUser, autoFill, searchLogin, deleteAccount, myProfile, fillData, editPictures, checkAuth };
