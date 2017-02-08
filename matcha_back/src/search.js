import geolib from 'geolib';
import mongoConnect from '../mongo_connect';

// const session = require('express-session');

// const isEmpty = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object;

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
        try {
          const match = await db.collection('users').aggregate([
            {
              $match:
              {
                $or: [{ gender: 'male', orientation: 'straight' }, { gender: 'male', orientation: 'bisexual' }]
              },
            },
          ]).toArray();
          if (req.user.blocked) {
            const block = req.user.blocked.map((src, key) => {
              const response = match.map((data, key) => {
                if (data.username.includes(src)) {
                  console.log('1 found blocked');
                }
              });
            });
          }
          if (match.includes(req.user.blocked))
          match.forEach((user) => {
            if (!user.location) return user.distance = -1;
            // if (!req.user.location || isEmpty(req.user.location)) {
            //   req.user.location.lat = '14.32';
            //   req.user.location.lng = '10.12';
            //   console.log(req.user.location.lat);
            // }
            user.distance = geolib.getDistance(
              { latitude: user.location.lat, longitude: user.location.lng },
              { latitude: req.user.location.lat, longitude: req.user.location.lng });
            user.distance = Math.round((user.distance / 1000));
          });
          const addedPop = popularity(match);
          res.send({ status: true, details: addedPop });
        } catch (err) {
          console.error(err);
        }
      }
      if (req.user.orientation === 'gay') {
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $or: [{ gender: 'female', orientation: 'gay' }, { gender: 'female', orientation: 'bisexual' }], username: { $nin: [req.user.username] }
            },
          },
        ]).toArray();
        if (req.user.blocked) {
          const block = req.user.blocked.map((src, key) => {
            const response = match.map((data, key) => {
              if (data.username.includes(src)) {
                console.log('2 found blocked');
              }
            });
          });
        }
        match.forEach((user) => {
          if (!user.location) return user.distance = -1;
          // if (!req.user.location || isEmpty(req.user.location)) {
          //   req.user.location.lat = '14.32';
          //   req.user.location.lng = '10.12';
          //   console.log(req.user.location.lat);
          // }
          user.distance = geolib.getDistance(
            { latitude: user.location.lat, longitude: user.location.lng },
            { latitude: req.user.location.lat, longitude: req.user.location.lng });
          user.distance = Math.round((user.distance / 1000));
        });
        const addedPop = popularity(match);
        res.send({ status: true, details: addedPop });
      }
      if (req.user.orientation === 'bisexual') {
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $nor: [{ gender: 'female', orientation: 'straight' }, { gender: 'male', orientation: 'gay' }, { username: req.user.username }]
            },
          },
        ]).toArray();
        const noBlock = match.filter((user) => !areBlocked(user, req.user));
        console.log(noBlock);
        const withDistAndPop = noBlock.map(el => {
          // ADD DISTANCE
          if (el.location) {
            el.distance = geolib.getDistance(
              { latitude: el.location.lat, longitude: el.location.lng },
              { latitude: req.user.location.lat, longitude: req.user.location.lng }
            );
          } else el.distance = -1;

          // ADD POP
          el.popularity = addPop(el);
          return el;
      });
      console.log(withDistAndPop);
      res.send({ status: true, details: withDistAndPop });
      }
    }
    if (req.user.gender === 'male') {
      console.log('male');
      if (req.user.orientation === 'straight') {
        console.log('malzcdse');
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $or: [{ gender: 'female', orientation: 'straight' }, { gender: 'female', orientation: 'bisexual' }]
            },
          },
        ]).toArray();
        if (req.user.blocked) {
          const block = req.user.blocked.map((src, key) => {
            const response = match.map((data, key) => {
              if (data.username.includes(src)) {
                console.log('4 found blocked');

              }
            });
          });
        }
        match.forEach((user) => {
          // console.log(typeof req.user.location);
          // if (!req.user.location || isEmpty(req.user.location)) {
          //   req.user.location.lat = '14.32';
          //   req.user.location.lng = '10.12';
          //   console.log(req.user.location.lat);
          // }
          // if (!user.location) return user.distance = -1;
          console.log(user.location);
          console.log(user.location);
          user.distance = geolib.getDistance(
            { latitude: user.location.lat, longitude: user.location.lng },
            { latitude: req.user.location.lat, longitude: req.user.location.lng });
          user.distance = Math.round((user.distance / 1000));
        });
        const addedPop = popularity(match);
        res.send({ status: true, details: addedPop });
      }
      if (req.user.orientation === 'gay') {
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $or: [{ gender: 'male', orientation: 'gay' }, { gender: 'male', orientation: 'bisexual' }], username: { $nin: [req.user.username] }
            },
          },
        ]).toArray();
        if (req.user.blocked) {
          const block = req.user.blocked.map((src, key) => {
            const response = match.map((data, key) => {
              if (data.username.includes(src)) {
                console.log('5 found blocked');
              }
            });
          });
        }
         match.forEach((user) => {
          if (!user.location) return user.distance = -1;
          // if (!req.user.location || isEmpty(req.user.location)) {
          //   req.user.location.lat = '14.32';
          //   req.user.location.lng = '10.12';
          //   console.log(req.user.location.lat);
          // }
          user.distance = geolib.getDistance(
            { latitude: user.location.lat, longitude: user.location.lng },
            { latitude: req.user.location.lat, longitude: req.user.location.lng });
          user.distance = Math.round((user.distance / 1000));
        });
        const addedPop = popularity(match);
        res.send({ status: true, details: addedPop });
      }
      if (req.user.orientation === 'bisexual') {
        const match = await db.collection('users').aggregate([
          {
            $match:
            {
              $nor: [{ gender: 'male', orientation: 'straight' }, { gender: 'female', orientation: 'gay' }, { username: req.user.username }]
            },
          },
        ]).toArray();
        if (req.user.blocked) {
          const block = req.user.blocked.map((src, key) => {
            const response = match.map((data, key) => {
              if (data.username.includes(src)) {
                console.log(' 6 found blocked');
              }
            });
          });
        }
        match.forEach((user) => {
          if (!user.location) return user.distance = -1;
          // if (!req.user.location || isEmpty(req.user.location)) {
          //   req.user.location.lat = '14.32';
          //   req.user.location.lng = '10.12';
          //   console.log(req.user.location.lat);
          // }
            user.distance = geolib.getDistance(
              { latitude: user.location.lat, longitude: user.location.lng },
              { latitude: req.user.location.lat, longitude: req.user.location.lng });
            user.distance = Math.round((user.distance / 1000));
        });
          const addedPop = popularity(match);
          res.send({ status: true, details: addedPop });
      }
    }
  });
};

export { search, popularity };
