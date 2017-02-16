const mongodb = require('mongodb');

const MongoConnect = (response, success) => {
	const mdb = mongodb.MongoClient;
	const url = 'mongodb://asalama:Andrea020289@ds137267.mlab.com:37267/matcha';
	mdb.connect(url, (err, db) => (err ? response.send('fail') : success(db))
	);
};

export default MongoConnect;
