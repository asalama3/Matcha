import * as search from './search';
import mongoConnect from '../mongo_connect';
import geolib from 'geolib';
var _ = require('lodash');


const suggestions = (req, res) => {
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
          const noBlock = match.filter((user) => !search.areBlocked(user, req.user));
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
            el.popularity = search.addPop(el);
            return el;
          });
          const filterDist = withDistAndPop.filter((user) => user.distance < 15);
          const filterPop = filterDist.filter((user) => user.popularity >= 50);
          const AgeMaxRange = req.user.age + 10;
          const AgeMinRange = req.user.age - 10;
          const filterAge = filterPop.filter((user) =>
          user.age >= AgeMinRange && user.age <= AgeMaxRange);
          const filterTags = filterAge.filter((user) => {
            if (user.hobbies) {
              const test = user.hobbies.filter(tag =>
              req.user.hobbies ? req.user.hobbies.includes(tag) : filterAge);
              return test;
            } else {
              return filterAge;
            }
          });
          const getTenUsers = filterTags.slice(0, 10);
          return res.send({ status: true, details: getTenUsers });
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
        const noBlock = match.filter((user) => !search.areBlocked(user, req.user));
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
          el.popularity = search.addPop(el);
          return el;
        });
        const filterDist = withDistAndPop.filter((user) => user.distance < 15);
        const filterPop = filterDist.filter((user) => user.popularity >= 50);
        const AgeMaxRange = req.user.age + 10;
        const AgeMinRange = req.user.age - 10;
        const filterAge = filterPop.filter((user) =>
        user.age >= AgeMinRange && user.age <= AgeMaxRange);

        const filterTags = filterAge.filter((user) => {
          if (user.hobbies){
            const test = user.hobbies.filter(tag =>
              req.user.hobbies ? req.user.hobbies.includes(tag) : filterAge);
              return test;
            } else {
              return filterAge;
            }
        });
        const getTenUsers = filterTags.slice(0, 10);
        return res.send({ status: true, details: getTenUsers });
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
        const noBlock = match.filter((user) => !search.areBlocked(user, req.user));
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
          el.popularity = search.addPop(el);
          return el;
      });
      const filterDist = withDistAndPop.filter((user) => user.distance < 15);
      const filterPop = filterDist.filter((user) => user.popularity >= 50);
      const AgeMaxRange = req.user.age + 10;
      const AgeMinRange = req.user.age - 10;
      const filterAge = filterPop.filter((user) =>
      user.age >= AgeMinRange && user.age <= AgeMaxRange);

      const filterTags = filterAge.filter((user) => {
        if (user.hobbies){
          const test = user.hobbies.filter(tag =>
            req.user.hobbies ? req.user.hobbies.includes(tag) : filterAge);
            return test;
          } else {
            return filterAge;
          }
      });
      const getTenUsers = filterTags.slice(0, 10);
      return res.send({ status: true, details: getTenUsers });
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
      const noBlock = match.filter((user) => !search.areBlocked(user, req.user));
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
        el.popularity = search.addPop(el);
        return el;
      });
      const filterDist = withDistAndPop.filter((user) => user.distance < 15);
      const filterPop = filterDist.filter((user) => user.popularity >= 50);
      const AgeMaxRange = req.user.age + 10;
      const AgeMinRange = req.user.age - 10;
      const filterAge = filterPop.filter((user) =>
      user.age >= AgeMinRange && user.age <= AgeMaxRange);

      const filterTags = filterAge.filter((user) => {
        if (user.hobbies) {
          const test = user.hobbies.filter(tag =>
            req.user.hobbies ? req.user.hobbies.includes(tag) : filterAge);
            return test;
          } else {
            return filterAge;
          }
      });
      const getTenUsers = filterTags.slice(0, 10);
      return res.send({ status: true, details: getTenUsers });
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
      const noBlock = match.filter((user) => !search.areBlocked(user, req.user));
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
        el.popularity = search.addPop(el);
        return el;
      });
      const filterDist = withDistAndPop.filter((user) => user.distance < 15);
      const filterPop = filterDist.filter((user) => user.popularity >= 50);
      const AgeMaxRange = req.user.age + 10;
      const AgeMinRange = req.user.age - 10;
      const filterAge = filterPop.filter((user) =>
      user.age >= AgeMinRange && user.age <= AgeMaxRange);

      const filterTags = filterAge.filter((user) => {
        if (user.hobbies){
          const test = user.hobbies.filter(tag =>
            req.user.hobbies ? req.user.hobbies.includes(tag) : filterAge);
            return test;
          } else {
            return filterAge;
          }
      });
      const getTenUsers = filterTags.slice(0, 10);
      return res.send({ status: true, details: getTenUsers });
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
      const noBlock = match.filter((user) => !search.areBlocked(user, req.user));
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
        el.popularity = search.addPop(el);
        return el;
      });
      const filterDist = withDistAndPop.filter((user) => user.distance < 15);
      const filterPop = filterDist.filter((user) => user.popularity >= 50);
      const AgeMaxRange = req.user.age + 10;
      const AgeMinRange = req.user.age - 10;
      const filterAge = filterPop.filter((user) =>
      user.age >= AgeMinRange && user.age <= AgeMaxRange);

      const filterTags = filterAge.filter((user) => {
        if (user.hobbies) {
          const test = user.hobbies.filter(tag =>
            req.user.hobbies ? req.user.hobbies.includes(tag) : filterAge);
            return test;
          } else {
            return filterAge;
          }
      });
      const getTenUsers = filterTags.slice(0, 10);
      return res.send({ status: true, details: getTenUsers });
    }
  }
});
};


export { suggestions };
