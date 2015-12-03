var mongoose = require('mongoose')
var user = require('../models/user');
var activity = require('../models/activity');
var ObjectId =mongoose.Schema.Types.ObjectId
var Hashids=require('hashids')
var hashids = new Hashids("together");


exports.joinActivity=function(req,res,next){
	var activityId=req.params.id
	var user=req.user

	activity.findOneAndUpdate({hid:activityId,quota:{$gt:0}},{$addToSet:{participants:{id:user._id,availdableAt:""}},$inc:{quota:-1}},function(err,act){
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
	var user=req.user

	activity.findOneAndUpdate({hid:activityId,$where:"this.quota<this.size"},{$pull:{participants:user._id},$inc:{quota:1}},function(err,act){
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

exports.vote=function(req,res){
	var actid=req.body.actid
	var thevote=req.body.vote

	activity.findOneAndUpdate({hid:actid,"participants.id":uid},{"participants.$.availdableAt":thevote},function(err,act){
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



