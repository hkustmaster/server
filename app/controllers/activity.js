var mongoose = require('mongoose')
var activity = require('../models/activity');
var activitySchema = require('../schemas/activity')
var ObjectId =mongoose.Schema.Types.ObjectId
var Hashids=require('hashids')
var hashids = new Hashids("together");
// signup
exports.showAll = function(req, res ,next) {
  activity.find({}).populate("host","name").exec(function(err,act){
    if(err)
      console.log(err);
    res.json({message:"Succeed",act:act});
  });
}

exports.showAround=function(req,res){
  var distance=req.body.distance
  var limit=req.body.limit
  var loc=req.body.location
  activity.aggregate(
    [{
        "$geoNear": {
            "near": [10, 10],
            "maxDistance": 10000,
            "distanceMultiplier": 6371,
            "spherical": true,
            "distanceField": "dis",
            "includelocs":"loc"
        }
    },{
        "$limit": 10
    }],
    function(err, docs) {
        if (err) {
            console.log(err);
        } else {
            res.json(docs)
            docs.forEach(function(element, index){
                console.log(element);
            });
        }
        // These are not mongoose documents, but you can always cast them
    }
  );
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
  var temp=req.body
  activity.findOneAndUpdate({id:req.body.id,"host": req.user._id},{$set:temp},function(err,act){
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
console.log(req.body)
  req.body.host=req.user
  var temp=new activity(req.body)
  temp.save(function(err,act){
    if (err){
	console.log(err)
      res.json({message:"Server Error"})
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
      
    }
  })
}

// show activity details
exports.showDetail = function(req, res, next) {
  var id=req.body.id
  var user=req.user
  activity.findOne({$and: [
          {id:id},
          {$or: [{"host": user._id}, {"participants.id": user._id}] }
      ]}).populate("host","name").populate("participants").exec(function(err,doc){
    if(err){
      res.json({message:"Server Error"});
    }
    if(!doc){
      res.json({message:"Unauthorized or No such Activity"});
    }
    else{
      delete doc.password
      res.json({message:"Succeed",act:doc});
    }
      
  })
 
}

exports.showMine = function(req, res, next) {
  var user=req.user
  activity.find({$or: [{"host": user._id}, {"participants.id": user._id}]}).populate("host","name").exec(function(err,doc){
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




