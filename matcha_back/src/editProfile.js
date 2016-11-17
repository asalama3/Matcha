import MongoConnect from '../mongo_connect';
var session = require('express-session');
import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectId;

const editProfile = (req, res) => {
    MongoConnect(res, function(db){
        console.log(req.body);
        console.log(session.user._id); // change in back - have to log back in to get session
        // update database grace a l'id recuperer de la session
        var user_info = { firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, gender: req.body.gender, 
            orientation: req.body.orientation, bio: req.body.bio, hobbies: req.body.hobbies, location: req.body.location };

        db.collection('users').findOne({_id: ObjectId(session.user._id)}, function (err, user){
            if (err)
                res.send({status: false, details: "db error"});
            else if (!user)
                res.send({status: false, details: "no user found" });
            else{
                console.log("user found insert update his infos");
                db.collection('users').update({_id: ObjectId(session.user._id)}, {$set:{ firstname: req.body.firstname } }, function (err, result){
                    if (err)
                        res.send({status: false, details: "db error"});
                }); // UPDATE et non ADD a new object // firstname marche au lieu de userinfo
                return res.send({status: true, details: "test edit profile"});
            } 
        })
    })
}

export {editProfile};