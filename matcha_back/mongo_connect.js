var mongodb = require('mongodb');



// const MongoConnect = (response, success) => {
//   const MongoClient = mongodb.MongoClient;
//   const url = 'mongodb://asalama:andrea2289@ds137267.mlab.com:37267/matcha';
//   MongoClient.connect(url, function (err, db) {
//     if (err) {
//       console.log('Unable to connect to the mongoDB server. Error:', err);
//     } else {
//       console.log('Connection established to', url);
//     }
//   });
// };

var MongoConnect = (response, success) => {
	var mdb = mongodb.MongoClient;
	var url = 'mongodb://asalama:Andrea020289@ds137267.mlab.com:37267/matcha';
	mdb.connect(url, (err, db) => {
    if (err) {
      console.log('erreur');
    }
    else {
      console.log('bravo');
    }
    (err ? response.send('fail') : success(db));
  });
}


export default MongoConnect;
