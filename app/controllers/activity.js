var mongoose = require('mongoose')
var activity = require('../models/activity');

// signup
exports.showAll = function(req, res ,next) {
  activity.find({},function(err,act){
    if(err)
      console.log(err);
    console.log(act); 
    res.render('list', { title:"ALL", activities:act});
  });
}

exports.editOne = function(req, res,next) {
  var getid=req.params.id;
  activity.findOne({id:getid},function(err,doc){
    if(err)
      console.log(err)
    if(doc)
      res.render('edit', {title: "Edit",id:doc.id,name:doc.name,time:doc.time,type:doc.type});
    else
      res.render('edit',{title: "NOT Exist"});
  });
}
exports.postEdit = function(req, res,next) {
  var id=req.body.id;
  var name=req.body.name;
  var time=req.body.time;
  var type=req.body.type;
  console.log(id);
  activity.findOneAndUpdate({id:id},{name:name,time:time,type:type},function(err,act){
    if (err){
      res.redirect("/");
    }
    else if (!act){
      res.render('edit',{title: "Not Exist"});
    } 
    else{
      res.render('edit', { title: 'Success!' });
    }
  });
}

exports.delete = function(req, res,next) {
  var id=req.params.id;
  activity.findOneAndRemove({id:id},function(err,doc){
          console.log(doc);
    if (err)
      console.log(err)
    else
      res.render('delete', { title: 'Success', obj: JSON.stringify(doc) });
  });
}

// to create page
exports.createPage =  function(req, res, next) {
  res.render('create', { title: 'test' });
}

// new an activity
exports.new = function(req, res, next) {
  var id=req.body.id;
  var name=req.body.name;
  var time=req.body.time;
  var type=req.body.type;
  activity.create({id:id,name:name,type:type,time:time},function(err,act){
    if (err)
      res.redirect("/");
    else
      res.render('create', { title: 'Success' });
  });
}

// show activity details
exports.showDetail = function(req, res, next) {
  var id=req.params.id;
  res.render('detail', { title: 'test', id: id});
}

