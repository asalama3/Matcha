import MongoConnect from '../mongo_connect';
var session = require('express-session');
import mongodb from 'mongodb';


const search = async (req, res) => {
  MongoConnect(res, async function(db){
    if (session.user.gender === 'female')
    {
      if (session.user.orientation === 'straight')
      {
  //      const match = await db.collection('users').find({gender: 'male', orientation: 'straight'}).toArray();
  //      console.log(match);

        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $or: [{gender: 'male', orientation: 'straight' }, {gender: 'male', orientation: 'bisexual' }]
            }
          }
        ]).toArray();
        console.log("user is a female straight:", match);
        res.send({status: true, details: match});

/*        one.on('data', function(res, doc) {
          console.log("hey", doc);
        }); */
      }
      if (session.user.orientation === 'gay')
      {
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $or: [{gender: 'female', orientation: 'gay' }, {gender: 'female', orientation: 'bisexual' }], username: { $nin: [session.user.username] }
            }
          }
        ]).toArray();
        console.log("user is a female gay:", match);
        res.send({status: true, details: match});
      }
      if (session.user.orientation === 'bisexual')
      {
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $nor: [{gender: 'female', orientation: 'straight' }, {gender: 'male', orientation: 'gay'}, { username: session.user.username } ]
            }
          }
        ]).toArray();
        console.log("user is a female bi:", match);
        res.send({status: true, details: match});
      }
    }
    if (session.user.gender === 'male')
    {
      if (session.user.orientation === 'straight')
      {
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $or: [{gender: 'female', orientation: 'straight' }, {gender: 'female', orientation: 'bisexual' }]
            }
          }
        ]).toArray();
        console.log("user is a male straight:", match);
        res.send({status: true, details: match});
      }
      if (session.user.orientation === 'gay')
      {
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $or: [{gender: 'male', orientation: 'gay' }, {gender: 'male', orientation: 'bisexual' }], username: { $nin: [session.user.username] }
            }
          }
        ]).toArray();
        console.log("user is a male gay:", match);
        res.send({status: true, details: match});
      }
      if (session.user.orientation === 'bisexual')
      {
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $nor: [{gender: 'male', orientation: 'straight' }, {gender: 'female', orientation: 'gay'}, { username: session.user.username }]
            }
          }
        ]).toArray();
        console.log("user is a male bi:", match);
        res.send({status: true, details: match});
      }
    }
  })
}

export  {search};
