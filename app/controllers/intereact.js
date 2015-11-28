var mongoose = require('mongoose')
var user = require('../models/user');
var activity = require('../models/activity');
var ObjectId =mongoose.Schema.Types.ObjectId
var Hashids=require('hashids')
var hashids = new Hashids("together");


exports.joinActivity=function(req,res,next){
	var activityId=req.params.id
	var user=req.session.user

	activity.findOneAndUpdate({hashid:activityId,quota:{$gt:0}},{$addToSet:{participants:user._id},$inc:{quota:-1}},function(err,act){
		if(err){
			console.log(err)
		}
		else{
			if(act)
				res.render('success');
			else
				res.render('fail');
		}
	})

}

exports.leaveActivity=function(req,res,next){
	var activityId=req.params.id
	var user=req.session.user

	activity.findOneAndUpdate({hashid:activityId,$where:"this.quota<this.size"},{$pull:{participants:user._id},$inc:{quota:1}},function(err,act){
		if(err){
			console.log(err)
		}
		else{
			if(act)
				res.render('success');
			else
				res.render('fail');
		}
	})

}