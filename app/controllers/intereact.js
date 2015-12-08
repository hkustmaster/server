var mongoose = require('mongoose')
var user = require('../models/user');
var activity = require('../models/activity');
var ObjectId =mongoose.Schema.Types.ObjectId
var Hashids=require('hashids')
var hashids = new Hashids("together");
var Comment = new require('../models/comment')


exports.joinActivity=function(req,res,next){
	var activityId=req.body.id
	var user=req.user
console.log(req.body)
	activity.findOneAndUpdate({id:activityId,quota:{$gt:0}},{$addToSet:{participants:{id:user._id,availdableAt:""}},$inc:{quota:-1}},function(err,act){
		if(err){
console.log(err)
			res.json({message:"Server Error"})
		}
		else{
			if(act)
				res.json({message:"Succeed"})
			else
				res.json({message:"No such activity"});
		}
	})

}

exports.leaveActivity=function(req,res,next){
	var activityId=req.body.id
	var user=req.user

	activity.findOneAndUpdate({id:activityId,"participants.id":user._id,$where:"this.quota<this.size"},{$pull:{participants:{id:user._id}},$inc:{quota:1}},function(err,act){
		if(err){
console.log(err)
			res.json({message:"Server Error"})
		}
		else{
			if(act)
				res.json({message:"Succeed"})
			else
				res.json({message:"No such activity"});
		}
	})

}

exports.vote=function(req,res){
	var actid=req.body.actid
	var thevote=req.body.vote
	console.log(thevote)
	activity.findOneAndUpdate({hid:actid,"participants.id":req.user._id},{$set:{participants.$.availdableAt:thevote}},function(err,act){
		if(err)
			res.json({message:"Server Error"})
		else
			res.json({message:"Succeed"})
	})
}

exports.kick=function(req,res){
    if(kick){
      activity.findOneAndUpdate({id:id}, {$pull:{participants:invite} },function(err,act){
        if (err){
          res.redirect("/");
        }
        else if (!act){
          res.render('edit',{title: "Not Exist"});
        } 
        else{
          res.render('edit', { title: 'Kicked!' });
        }
      });
    }
    else{
      activity.findOneAndUpdate({id:id}, {$push:{participants:invite} },function(err,act){
        if (err){
          console.log(err)
        }
        else if (!act){
          res.render('edit',{title: "Not Exist"});
        } 
        else{
          res.render('edit', { title: 'ADDed!' });
        }
      });
    }
}



