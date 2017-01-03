import geolib from 'geolib';
import mongoConnect from '../mongo_connect';

const session = require('express-session');

const popularity = (allUsers) => {
  if (Array.isArray(allUsers)) {
    const pop = allUsers.map((src) => {
      if (src.interestedBy) {
      const numberLikes = src.interestedBy.length;
      const numberViews = src.views.number;
      src.popularity = (numberLikes / numberViews) * 100;
      } else {
        src.popularity = 0;
      }
      return src;
    });
    return pop;
  }
  if (allUsers.interestedBy) {
    const numberLikes = allUsers.interestedBy.length;
    const numberViews = allUsers.views.number;
    if (numberViews === 0) {
         allUsers.popularity = 0;
    } else {
      allUsers.popularity = (numberLikes / numberViews) * 100;
    }
  } else {
    allUsers.popularity = 0;
  }
  return allUsers;
};

const search = async (req, res) => {
  mongoConnect(res, async (db) => {
    if (session.user.gender === 'female') {
      if (session.user.orientation === 'straight') {
        try {
          const match = await db.collection('users').aggregate([
            {
              $match:
              {
                $or: [{ gender: 'male', orientation: 'straight' }, { gender: 'male', orientation: 'bisexual' }]
              },
            },
          ]).toArray();
          match.forEach((user) => {
            if (!user.location) return user.distance = -1;
            user.distance = geolib.getDistance(
              { latitude: user.location.lat , longitude: user.location.lng },
              { latitude: session.user.location.lat, longitude: session.user.location.lng });
            user.distance = (user.distance / 1000).toFixed(2);
          });
          const addedPop = popularity(match);
          res.send({ status: true, details: addedPop });
        } catch (err) {
          console.error(err);
        }
      }
      if (session.user.orientation === 'gay') {
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $or: [{gender: 'female', orientation: 'gay' }, { gender: 'female', orientation: 'bisexual' }], username: { $nin: [session.user.username] }
            },
          },
        ]).toArray();
        match.forEach((user) => {
          if (!user.location) return user.distance = -1;
          user.distance = geolib.getDistance(
            { latitude: user.location.lat, longitude: user.location.lng },
            { latitude: session.user.location.lat, longitude: session.user.location.lng });
          user.distance = (user.distance / 1000).toFixed(2);
        });
        const addedPop = popularity(match);
        res.send({ status: true, details: addedPop });
      }
      if (session.user.orientation === 'bisexual') {
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $nor: [{ gender: 'female', orientation: 'straight' }, { gender: 'male', orientation: 'gay' }, { username: session.user.username }]
            },
          },
        ]).toArray();
        match.forEach((user) => {
          if (!user.location) return user.distance = -1;
          user.distance = geolib.getDistance(
            { latitude: user.location.lat, longitude: user.location.lng },
            { latitude: session.user.location.lat, longitude: session.user.location.lng });
          user.distance = (user.distance / 1000).toFixed(2);
        });
        const addedPop = popularity(match);
        res.send({ status: true, details: addedPop });
      }
    }
    if (session.user.gender === 'male') {
      if (session.user.orientation === 'straight') {
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $or: [{ gender: 'female', orientation: 'straight' }, { gender: 'female', orientation: 'bisexual' }]
            },
          },
        ]).toArray();
        match.forEach((user) => {
          if (!user.location) return user.distance = -1;
          user.distance = geolib.getDistance(
            { latitude: user.location.lat , longitude: user.location.lng },
            { latitude: session.user.location.lat, longitude: session.user.location.lng });
          user.distance = (user.distance / 1000).toFixed(2);
        });
        const addedPop = popularity(match);
        res.send({ status: true, details: addedPop });
      }
      if (session.user.orientation === 'gay') {
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $or: [{ gender: 'male', orientation: 'gay' }, { gender: 'male', orientation: 'bisexual' }], username: { $nin: [session.user.username] }
            },
          },
        ]).toArray();
         match.forEach((user) => {
          if (!user.location) return user.distance = -1;
          user.distance = geolib.getDistance(
            { latitude: user.location.lat , longitude: user.location.lng },
            { latitude: session.user.location.lat, longitude: session.user.location.lng });
          user.distance = (user.distance / 1000).toFixed(2);
        });
        const addedPop = popularity(match);
        res.send({ status: true, details: addedPop });
      }
      if (session.user.orientation === 'bisexual') {
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $nor: [{ gender: 'male', orientation: 'straight' }, { gender: 'female', orientation: 'gay' }, { username: session.user.username }]
            },
          },
        ]).toArray();
        match.forEach((user) => {
          if (!user.location) return user.distance = -1;
            user.distance = geolib.getDistance(
              { latitude: user.location.lat , longitude: user.location.lng },
              { latitude: session.user.location.lat, longitude: session.user.location.lng });
            user.distance = (user.distance / 1000).toFixed(2);
        });
          const addedPop = popularity(match);
          res.send({ status: true, details: addedPop });
      }
    }
  });
};

export { search, popularity };
