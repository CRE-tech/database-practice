var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost:27017/test', ['users']);
var usersCollection = db.collection('users');
const bcrypt = require("bcrypt-nodejs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy(authenticate));
passport.use("local-register", new LocalStrategy({passReqToCallback: true}, register));

function authenticate(email, password, done){
	usersCollection
		.findOne({email: email}, function(err, user) {
			//console.log(user)
			//res.send(user)
			if(!user || !bcrypt.compareSync(password, user.password)) {
				console.log('not found')
				return done(null, false, {message: "Invalid user and password combination"});
			}
			console.log('found');
			done(null, user);
		},done)
		
}

function register(req, email, password, done){
	/*if(usersCollection.findOne({email:email})){
				console.log(email)
				return done(null, false, {message: "User already exists"});
			}*/
	usersCollection
		.findOne({email: email}, function(err, user) {
			if(user){
				console.log(email)
				return done(null, false, {message: "User already exists"});
			}
			if(password !== req.body.password2){
				console.log("password")
				return done(null, false, {message: "Passwords do not match"});
			}

			const newUser = {
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				email: email,
				password: bcrypt.hashSync(req.body.password)
			}
			usersCollection
				.insert(newUser, function(ids){
					newUser.id = ids
					done(null, newUser)

				})
				/*.toArray((ids) => {
					newUser.id = ids[0]
					done(null, newUser)
				})*/
				

		})
}



passport.serializeUser(function(user, done){
	done(null, user);

})

passport.deserializeUser(function(id, done){
	usersCollection
		.find({_id : id}, function(err, user) {
		//.find({_id: id})
		//.toArray((err, user) => {

			done(null,user)
		},done)
		//.where("id", id)
		//.first()
		//.then((user) => {
		//	done(null, user)
		//},done )
})