import geolib from 'geolib';
import mongoConnect from '../mongo_connect';
var _ = require('lodash');

const areBlocked = (userA, userB) =>
  (userA.blocked && userA.blocked && userA.blocked.length && !!userA.blocked.find(el => el === userB.username))
  ||
  (userB.blocked && userB.blocked.length && !!userB.blocked.find(el => el === userA.username));

const addPop = (user) => {
  if (user.interestedBy) {
    const numberLikes = user.interestedBy.length;
    const numberViews = user.views.number;
    return Math.round((numberLikes / numberViews) * 100);
  }
  return 0;
};

const popularity = (allUsers) => {
  if (Array.isArray(allUsers)) {
    const pop = allUsers.map(addPop);
  }
  if (allUsers.interestedBy) {
    const numberLikes = allUsers.interestedBy.length;
    const numberViews = allUsers.views.number;
    if (numberViews === 0) {
         allUsers.popularity = 0;
    } else {
      allUsers.popularity = Math.round((numberLikes / numberViews) * 100);
    }
  } else {
    allUsers.popularity = 0;
  }
  return allUsers;
};

const search = async (req, res) => {
  mongoConnect(res, async (db) => {
    if (req.user.gender === 'female') {
      if (req.user.orientation === 'straight') {
          const match = await db.collection('users').aggregate([
            {
              $match:
              {
                $or: [
                  { gender: 'male', orientation: 'straight' },
                  { gender: 'male', orientation: 'bisexual' }
                ]
              },
            },
          ]).toArray();
          const noBlock = match.filter((user) => !areBlocked(user, req.user));
          const withDistAndPop = noBlock.map(el => {
            // ADD DISTANCE
            if (el.location) {
              el.distance = geolib.getDistance(
                { latitude: el.location.lat, longitude: el.location.lng },
                { latitude: req.user.location.lat, longitude: req.user.location.lng }
              );
              el.distance = Math.round((el.distance / 1000));
            } else el.distance = -1;

            // ADD POP
            el.popularity = addPop(el);
            return el;
        });
        res.send({ status: true, details: withDistAndPop });
      }
      if (req.user.orientation === 'gay') {
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $or: [
                { gender: 'female', orientation: 'gay' },
                { gender: 'female', orientation: 'bisexual' }
              ],
              username: { $nin: [req.user.username] }
            },
          },
        ]).toArray();
        const noBlock = match.filter((user) => !areBlocked(user, req.user));
        const withDistAndPop = noBlock.map(el => {
          // ADD DISTANCE
          if (el.location) {
            el.distance = geolib.getDistance(
              { latitude: el.location.lat, longitude: el.location.lng },
              { latitude: req.user.location.lat, longitude: req.user.location.lng }
            );
            el.distance = Math.round((el.distance / 1000));
          } else el.distance = -1;

          // ADD POP
          el.popularity = addPop(el);
          return el;
        });
        res.send({ status: true, details: withDistAndPop });
      }
      if (req.user.orientation === 'bisexual') {
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $nor: [
                { gender: 'female', orientation: 'straight' },
                { gender: 'male', orientation: 'gay' },
                { username: req.user.username }
              ]
            },
          },
        ]).toArray();
        const noBlock = match.filter((user) => !areBlocked(user, req.user));
        const withDistAndPop = noBlock.map(el => {
          // ADD DISTANCE
          if (el.location) {
            el.distance = geolib.getDistance(
              { latitude: el.location.lat, longitude: el.location.lng },
              { latitude: req.user.location.lat, longitude: req.user.location.lng }
            );
            el.distance = Math.round((el.distance / 1000));
          } else el.distance = -1;

          // ADD POP
          el.popularity = addPop(el);
          return el;
      });
      res.send({ status: true, details: withDistAndPop });
      }
    }
    if (req.user.gender === 'male') {
      if (req.user.orientation === 'straight') {
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $or: [
                { gender: 'female', orientation: 'straight' },
                { gender: 'female', orientation: 'bisexual' }
              ]
            },
          },
        ]).toArray();
        const noBlock = match.filter((user) => !areBlocked(user, req.user));
        const withDistAndPop = noBlock.map(el => {
          // ADD DISTANCE
          if (el.location) {
            el.distance = geolib.getDistance(
              { latitude: el.location.lat, longitude: el.location.lng },
              { latitude: req.user.location.lat, longitude: req.user.location.lng }
            );
            el.distance = Math.round((el.distance / 1000));
          } else el.distance = -1;

          // ADD POP
          el.popularity = addPop(el);
          return el;
        });
        res.send({ status: true, details: withDistAndPop });
      }
      if (req.user.orientation === 'gay') {
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $or: [
                { gender: 'male', orientation: 'gay' },
                { gender: 'male', orientation: 'bisexual' }
              ],
              username: { $nin: [req.user.username] }
            },
          },
        ]).toArray();
        const noBlock = match.filter((user) => !areBlocked(user, req.user));
        const withDistAndPop = noBlock.map(el => {
          // ADD DISTANCE
          if (el.location) {
            el.distance = geolib.getDistance(
              { latitude: el.location.lat, longitude: el.location.lng },
              { latitude: req.user.location.lat, longitude: req.user.location.lng }
            );
            el.distance = Math.round((el.distance / 1000));
          } else el.distance = -1;

          // ADD POP
          el.popularity = addPop(el);
          return el;
        });
        res.send({ status: true, details: withDistAndPop });
    }
      if (req.user.orientation === 'bisexual') {
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $nor: [
                { gender: 'male', orientation: 'straight' },
                { gender: 'female', orientation: 'gay' },
                { username: req.user.username }
              ],
            },
          },
        ]).toArray();
        const noBlock = match.filter((user) => !areBlocked(user, req.user));
        const withDistAndPop = noBlock.map(el => {
          // ADD DISTANCE
          if (el.location) {
            el.distance = geolib.getDistance(
              { latitude: el.location.lat, longitude: el.location.lng },
              { latitude: req.user.location.lat, longitude: req.user.location.lng }
            );
            el.distance = Math.round((el.distance / 1000));
          } else el.distance = -1;

          // ADD POP
          el.popularity = addPop(el);
          return el;
        });
        res.send({ status: true, details: withDistAndPop });
      }
    }
  });
};

const searchByTag = (req, res) => {
  if (_.isEmpty(req.body.tag)) return res.send({ status: true, details: req.body.newUsers });
  const searchTag = req.body.newUsers.filter((user) =>
  user.hobbies && user.hobbies.length && user.hobbies.includes(req.body.tag));
    res.send({ status: true, details: searchTag });
};

export { search, popularity, searchByTag, areBlocked, addPop };
