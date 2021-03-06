var mongoose = require('mongoose')
var Comment = mongoose.model('Comment')

// comment
exports.post = function(req, res) {
  var content= req.body.content
  var cid=req.body.cid
  //var tid=req.body.tid
  var activityId = req.body.id
  var user=req.user
  if (cid) {
    Comment.findById(cid, function(err, comment) {
      var reply = {
        from: user._id,
        to: tid,
        content: content
      }

      comment.reply.push(reply)

      comment.save(function(err, comment) {
        if (err) {
          console.log(err)
        }

        res.json({message:"Succeed"})
      })
    })
  }
  else {
    var comment = new Comment({
       content: req.body.content,
       "from.id":req.user._id,
       activity : req.body.id
    })
    comment.save(function(err, comment) {
      if (err) {
        console.log(err)
        res.json({message:"Server Error"})
      }
      else
        res.json({message:"Succeed"})
    })
  }
}
//get comments of an activity
exports.getComments=function(req,res){
  var activityId=req.body.id
  Comment.find({activity:activityId}).sort("createAt").populate("from.id","name").exec(function(err,comments){
    if(err)
      console.log(err)
    else
      res.json({message:"Succeed",comments:comments})
  })
}