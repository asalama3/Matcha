import MongoConnect from '../mongo_connect';
var session = require('express-session');
import mongodb from 'mongodb';
import multer from 'multer';

const addPic = (req, res) => {
       console.log(req.body);  // base64 img


     MongoConnect(res, function(db){
     })
 
    res.send({status: true, details: "ok"});
}

export {addPic};