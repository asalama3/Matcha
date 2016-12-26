import MongoConnect from '../mongo_connect';
var session = require('express-session');
import mongodb from 'mongodb';
import geolib from 'geolib';

const popularity = (allUsers) => {
  if (Array.isArray(allUsers)){
    const pop = allUsers.map((src, key) => {
      const number_likes = src.interestedBy.length;
      const number_views = src.views.number;
      // console.log('likes' , number_likes);
      // console.log('views' , number_views);
      src.popularity = (number_likes / number_views) * 100;
      return src;
    });
    return pop;
 }
  else{
    console.log('one user only ' , allUsers);
    const number_likes = allUsers.interestedBy.length;
    const number_views = allUsers.views.number;
    if (number_views === 0)
     {
       allUsers.popularity = 0;
     } else {
      allUsers.popularity = (number_likes / number_views) * 100;
      console.log(allUsers.popularity);
      // if (isNaN(allUsers.popularity || )){
        // allUsers.popularity = 0; 
      // }
  }
   return allUsers;
}
}

const search = async (req, res) => {
  MongoConnect(res, async function(db){
    if (session.user.gender === 'female')
    {
      if (session.user.orientation === 'straight')
      {
        try {
          const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $or: [{gender: 'male', orientation: 'straight' }, {gender: 'male', orientation: 'bisexual' }]
            }
          }
        ]).toArray();
        match.forEach((user) => {
          if (!user.location) return user.distance = -1;
            user.distance = geolib.getDistance(
              { latitude: user.location.lat , longitude: user.location.lng },
              { latitude: session.user.location.lat, longitude: session.user.location.lng})
            user.distance = (user.distance / 1000).toFixed(2) ;             
        });
        let addedPop = popularity(match);
        res.send({status: true, details: addedPop});
        } catch (err) {
          console.error(err);
        }
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

        match.forEach((user) => {
          if (!user.location) return user.distance = -1;          
            user.distance = geolib.getDistance(
              { latitude: user.location.lat , longitude: user.location.lng },
              { latitude: session.user.location.lat, longitude: session.user.location.lng})
        user.distance = (user.distance / 1000).toFixed(2) ;  
            
        });
         let addedPop = popularity(match);
        res.send({status: true, details: addedPop});
        // console.log("user is a female gay:", match);
        // res.send({status: true, details: match});
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
 
          match.forEach((user) => {
          if (!user.location) return user.distance = -1;            
            user.distance = geolib.getDistance(
              { latitude: user.location.lat , longitude: user.location.lng },
              { latitude: session.user.location.lat, longitude: session.user.location.lng})
            user.distance = (user.distance / 1000).toFixed(2) ;  
        });
         let addedPop = popularity(match);
        res.send({status: true, details: addedPop});
        // console.log("user is a female bi:", match);
        // res.send({status: true, details: match});
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

        match.forEach((user) => {
          if (!user.location) return user.distance = -1;                      
            user.distance = geolib.getDistance(
              { latitude: user.location.lat , longitude: user.location.lng },
              { latitude: session.user.location.lat, longitude: session.user.location.lng})
            user.distance = (user.distance / 1000).toFixed(2) ;  
        });
        let addedPop = popularity(match);
        res.send({status: true, details: addedPop});
        // console.log("user is a male straight:", match);
        // res.send({status: true, details: match});
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

         match.forEach((user) => {
          if (!user.location) return user.distance = -1;                                 
            user.distance = geolib.getDistance(
              { latitude: user.location.lat , longitude: user.location.lng },
              { latitude: session.user.location.lat, longitude: session.user.location.lng})
            user.distance = (user.distance / 1000).toFixed(2) ;  
        });
          let addedPop = popularity(match);
          res.send({status: true, details: addedPop});
        // console.log("user is a male gay:", match);
        // res.send({status: true, details: match});
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

        match.forEach((user) => {
          if (!user.location) return user.distance = -1;          
            user.distance = geolib.getDistance(
              { latitude: user.location.lat , longitude: user.location.lng },
              { latitude: session.user.location.lat, longitude: session.user.location.lng})
            user.distance = (user.distance / 1000).toFixed(2) ;  
        });
          let addedPop = popularity(match);
          res.send({status: true, details: addedPop});
        // console.log("user is a male bi:", match);
        // res.send({status: true, details: match});
      }
    }
  })
}

export  {search, popularity};
