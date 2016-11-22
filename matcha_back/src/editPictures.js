import MongoConnect from '../mongo_connect';
var session = require('express-session');
import mongodb from 'mongodb';

const addPic = (req, res) => {
       console.log(req.body);  // vide?


     MongoConnect(res, function(db){
     })
 
    res.send({status: true, details: "ok"});
}

export {addPic};