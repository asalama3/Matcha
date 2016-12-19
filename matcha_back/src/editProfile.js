import MongoConnect from '../mongo_connect';
var session = require('express-session');
import mongodb from 'mongodb';
// import user from './user.js';

const ObjectId = mongodb.ObjectId;

const age_calculated = (birthday) => { 
    var ageDifMs = Date.now() - birthday.getTime();
    console.log('birthday', birthday);
    console.log('gettime', birthday.getTime());
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const editProfile = (req, res) => {
    MongoConnect(res, function(db){
        console.log(req.body);
        console.log(session.user._id); // change in back - have to log back in to get session
        // update database grace a l'id recuperer de la session
       
        var birthday = [req.body.year, req.body.month , req.body.day];
        var age = age_calculated(new Date(birthday));
        var user_info = { firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, age: age, day: req.body.day, month: req.body.month, year: req.body.year, gender: req.body.gender, 
            orientation: req.body.orientation, bio: req.body.bio, hobbies: req.body.hobbies, location: req.body.location, interestedIn: [], interestedBy: [] };

        db.collection('users').findOne({_id: ObjectId(session.user._id)}, function (err, user){
            if (err)
                res.send({status: false, details: "db error"});
            else if (!user)
                res.send({status: false, details: "no user found" });
            else{
                console.log("user found insert update his infos");
                db.collection('users').update({_id: ObjectId(session.user._id)}, {$set: user_info}, function (err, result){
                    if (err)
                        res.send({status: false, details: "db error"});
                }); 
                return res.send({status: true, details: "test edit profile"});
            } 
        })
    })
}

export {editProfile};