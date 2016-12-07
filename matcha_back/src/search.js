import MongoConnect from '../mongo_connect';
var session = require('express-session');
import mongodb from 'mongodb';


const search = async (req, res) => {
  MongoConnect(res, async function(db){
    // console.log('session for search' , session.user.gender);
    if (session.user.gender === 'female')
    {
      if (session.user.orientation === 'straight')
      {
        const one = await db.collection('users').aggregate([
          {$match: 
            {
              $or: [{gender: 'male', orientation: 'straight' }, {gender: 'male', orientation: 'bisexual' }] 
            }
          }] 
        ).toArray();
        console.log("user is a female straight:", one);
/*        one.on('data', function(res, doc) {
          console.log("hey", doc);
         res.send({status: true, details: doc});
        });
 */     } /*
      if (session.user.orientation === 'gay')
      {
        db.collection('users').aggregate([
          { 
            $match: 
            {
              $or: [{gender: 'female', orientation: 'gay' }, {gender: 'female', orientation: 'bisexual' }] 
            }
          }] 
        )
      }*//*
      if (session.user.orientation === 'bisexual')
      {
        db.collection('users').aggregate([
          { 
            $match: 
            {
              $nor: [{gender: 'female', orientation: 'straight' }, {gender: 'male', orientation: 'gay' }] 
            }
          }] 
        )
      }*/
    }/*
    if (session.user.gender === 'male')
    {
      if (session.user.orientation === 'straight')
      {
        db.collection('users').aggregate([
          { 
            $match: 
            {
              $nor: [{gender: 'female', orientation: 'straight' }, {gender: 'female', orientation: 'bisexual' }] 
            }
          }] 
        )
      }
      if (session.user.orientation === 'gay')
      {
        db.collection('users').aggregate([
          { 
            $match: 
            {
              $nor: [{gender: 'male', orientation: 'gay' }, {gender: 'male', orientation: 'bisexual' }] 
            }
          }] 
        )
      }
      if (session.user.orientation === 'bisexual')
      {
        db.collection('users').aggregate([
          { 
            $match: 
            {
              $nor: [{gender: 'male', orientation: 'straight' }, {gender: 'female', orientation: 'gay' }] 
            }
          }] 
        )
      }
    }*/
  })
}

export  {search};
