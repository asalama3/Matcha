import mongodb from 'mongodb';
import fs from 'fs';
import mongoConnect from '../mongo_connect';


const objectId = mongodb.ObjectId;

const addPic = (req, res) => {
  mongoConnect(res, (db) => {
    if (!req.body.photo || !req.body.name || !req.body.type || !req.body.size) {
      res.send({ status: false, details: 'you need to select a photo' });
    } else if (req.body.size < 1000000) {
        if (req.body.type === 'image/jpeg' || req.body.type === 'image/jpg' ||
            req.body.type === 'image/png' || req.body.type === 'image/gif') {
              db.collection('users').findOne({ _id: objectId(req.user._id) }, (err, user) => {
                if (err) {
                  return res.send({ status: false, details: 'db error' });
                } else if (!user) {
                  return res.send({ status: false, details: 'no user found' });
                } else if (user.photo.length === 5) {
                  return res.send({ status: false, details: 'too many images' });
                }
                const matches = req.body.photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                if (matches.length !== 3) {
                  return res.send({ status: false, details: 'invalid input string' });
                }
                const imageBuffer = new Buffer(matches[2], 'base64');
                fs.writeFile(`./uploads/${req.user.username}/${req.body.name}`, imageBuffer, (error) => {
                  if (error) {
                    res.send({ status: false, details: 'could not upload picture' });
                    throw error;
                  }
                  let photo = [];
                  if (user.photo) {
                   photo = user.photo;
                  } else {
                   photo = [];
                  }
                  photo.push({ name: req.body.name, profil: false });
                  db.collection('users').update({ _id: objectId(req.user._id) }, { $set: { photo } }, (er) => {
                    if (er) {
                       return res.send({ status: false, details: 'db error' });
                    }
                    return res.send({ status: true, details: 'inserted photo ok', data: photo });
                  });
                  });
              });
        } else {
          return res.send({ status: false, details: 'wrong format' });
        }
      } else {
      return res.send({ status: false, details: 'wrong size' });
      }
  });
};


const deletePic = (req, res) => {
  mongoConnect(res, (db) => {
    fs.unlink(`./uploads/${req.user.username}/${req.body.name}`, (err) => {
      if (err) throw err;
    });
    db.collection('users').update({ _id: objectId(req.user._id) }, { $pull: { photo: { name: req.body.name } } }, (err) => {
      if (err) {
        return res.send({ status: false, details: 'db error' });
      } else {
        db.collection('users').findOne({ _id: objectId(req.user._id) }, (error, user) => {
          if (error) {
            return res.send({ status: false, details: 'db error' });
          }
          if (user) {
            const newPhotoArray = user.photo;
            return res.send({ status: true, details: 'deleted photo ok', values: newPhotoArray });
          }
          return false;
        });
      }
    });
  });
};

const profilePic = (req, res) => {
  mongoConnect(res, (db) => {
    db.collection('users').update({ _id: objectId(req.user._id) }, { $set: { ProfilePictureNumber: req.body.key } }, (err) => {
      if (err) {
        return res.send({ status: false, details: 'db error' });
      } else {
        return res.send({ status: true, details: 'make profile pic' });
      }
    });
  });
};

export { addPic, deletePic, profilePic };
