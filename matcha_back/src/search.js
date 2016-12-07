import MongoConnect from '../mongo_connect';
var session = require('express-session');

const search = (req, res) => {
  MongoConnect(res, function(db){
    if (session.user.gender === 'female')
    {
      if (session.user.orientation === 'straight')
      {

      }
      if (session.user.orientation === 'gay')
      {

      }
      if (session.user.orientation === 'bisexual')
      {

      }
    }
    if (session.user.gender === 'male')
    {
      if (session.user.orientation === 'straight')
      {

      }
      if (session.user.orientation === 'gay')
      {

      }
      if (session.user.orientation === 'bisexual')
      {

      }
    }
  })
}
