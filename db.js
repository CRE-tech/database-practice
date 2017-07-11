const MongoClient = require("mongodb").MongoClient;
var db;
MongoClient.connect("mongodb://localhost:27017/test", (err,connection) => {
	if(err){ console.log(err) }
	
	var db = connection;
	
})
	
module.exports = db