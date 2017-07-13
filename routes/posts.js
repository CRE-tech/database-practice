const passport = require("passport");
const router = require("express").Router();
var mongojs = require('mongojs');
const db = mongojs('mongodb://localhost:27017/test', ['posts']);
var userPosts = db.collection('posts');

function loginRequired(req,res,next){
	if(!req.isAuthenticated()){
		return res.redirect("/login")
	}

	next()
}
router
	.get("/posts", loginRequired, (req,res,next) => {
		userPosts
		.find({"_id": req.user.id}, function(err, posts) {
			res.render("posts", {
				title: "Your Posts",
				posts: posts,
			})
		})
	})
	/*.get("/allPosts", (req, res, next) => {
		userPosts
		function(err, posts) {
		res.render("posts", {
				title: "all user posts",
				posts: posts,
			})
	}
	})*/
	.get("/deletePost/:id", (req, res, next) => {
		userPosts
		.findOne({_id: req.params.id})
		.delete(), function(result){
			if( result === 0){
				return res.send("Error, could not delete post")
			}
			res.redirect("/allPosts")

		}

	})
module.exports = router;