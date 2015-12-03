var mongoose = require('mongoose')
var activity = require('../models/activity');
var ObjectId =mongoose.Schema.Types.ObjectId
var Hashids=require('hashids')
var hashids = new Hashids("together");
// signup
exports.showAll = function(req, res ,next) {
  activity.find({},function(err,act){
    if(err)
      console.log(err);
    res.json({message:"Succeed",act:act});
  });
}

exports.editOne = function(req, res,next) {
  var getid=req.params.id;
  activity.findOne({id:getid},function(err,doc){
    if(err)
      console.log(err)
    if(doc)
      res.render('edit', {title: "Edit",id:doc.id,name:doc.name,begin:doc.time.beginAt,end:doc.time.endAt,type:doc.type});
    else
      res.render('edit',{title: "NOT Exist"});
  });
}
exports.postEdit = function(req, res,next) {
  var temp=new activity({
    time:req.body.time;
    name:req.body.name;
    type:req.body.type;
    host:req.user._id;
    status:req.body.status;
    location:req.body.location;
    description:req.body.description;
    tbdtime :req.body.tbdtime;
    size :req.body.size;
  })
    activity.findOneAndUpdate({id:req.body.id,"host.id": user._id},{$set:temp},function(err,act){
      if (err){
        res.json({message:"Server Error"});
      }
      else if(!act){
        res.json({message:"Unauthorized or Activity Not Exist"});
      }
      else{
        res.json({message:"Succeed"});
      }
    });
  
  
}

exports.delete = function(req, res,next) {
  var id=req.params.id;
  activity.findOneAndRemove({id:id},function(err,doc){
    console.log(doc);
    if (err)
      res.json({message:"Server Error"});
    else
      res.json({message:"Succeed",act:doc});
  });
}

// to create page
exports.createPage =  function(req, res, next) {
  res.render('create', { title: 'test' });
}

// new an activity
exports.new = function(req, res, next) {
  var temp=new activity({
    time:req.body.time;
    name:req.body.name;
    type:req.body.type;
    host:req.user._id;
    status:req.body.status;
    location:req.body.location;
    description:req.body.description;
    tbdtime :req.body.tbdtime;
    size :req.body.size;
    quota: req.body.size-1
  })
  temp.save(function(err,act){
    if (err){
      res.redirect("/");
    }
    else{
      var hid=hashids.encodeHex(act._id)
      activity.findOneAndUpdate({_id:act._id},{$set:{id:hid.toString()}},function(err,before,after){
        if(err){
          res.json({message:"Server Error"});
        }
        else{
          res.json({message:"Succeed",act:after});
        }
      });
      //var temp={activityID:act._id,candidates:[{date:Date.parse("6/15/2008").toString(),count:0},{date:Date.parse("7/15/2008").toString(),count:0},{date:Date.parse("8/15/2008").toString(),count:0}]}
       //console.log("2!!!!!"+JSON.stringify(temp))
      
    }
  })
}

// show activity details
exports.showDetail = function(req, res, next) {
  var id=req.params.id;
  var user=req.user
  activity.findOne({$and: [
          {id:id},
          {$or: [{"host.id": user._id}, {"participants.id": user._id}] }
      ]}).populate("participants").exec(function(err,doc){
    if(err){
      res.json({message:"Server Error"});
    }
    if(!doc){
      res.json({message:"Unauthorized or No such Activity"});
    }
    else{
      res.json({message:"Succeed",act:doc});
    }
      
  })
 
}



