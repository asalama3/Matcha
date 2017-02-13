import mongodb from 'mongodb';
import mongoConnect from '../mongo_connect';
var _ = require('lodash');
// const session = require('express-session');

const objectId = mongodb.ObjectId;

const ageCalculated = (birthday) => {
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const editProfile = (req, res) => {
  mongoConnect(res, (db) => {
    const birthday = [req.body.year, req.body.month, req.body.day];
    const age = ageCalculated(new Date(birthday));
    let userInfo = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      age,
      day: req.body.day,
      month: req.body.month,
      year: req.body.year,
      gender: req.body.gender,
      orientation: req.body.orientation,
      bio: req.body.bio,
      hobbies: req.body.hobbies,
      location: req.body.location,
      interestedIn: [],
      interestedBy: [],
    };
    if (_.isEmpty(req.body.location)) {
      userInfo = _.omit(userInfo, ['location']);
      console.log('no location info user', userInfo);
    }
    console.log(userInfo);
    db.collection('users').findOne({ _id: objectId(req.user._id) }, (err, user) => {
      if (err) res.send({ status: false, details: 'db error' });
      else if (!user) res.send({ status: false, details: 'no user found' });
      else {
        db.collection('users').update({ _id: objectId(req.user._id) }, { $set: userInfo }, (error) => {
          if (error) res.send({ status: false, details: 'db error' });
        });
        return res.send({ status: true, details: 'test edit profile' });
      }
      return false;
    });
  });
};

export { editProfile };
