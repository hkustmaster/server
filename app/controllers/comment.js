var mongoose = require('mongoose')
var Comment = mongoose.model('Comment')

// comment
exports.post = function(req, res) {
  var _comment = req.body.comment
  var activityId = _comment.activity

  if (_comment.cid) {
    Comment.findById(_comment.cid, function(err, comment) {
      var reply = {
        from: _comment.from,
        to: _comment.tid,
        content: _comment.content
      }

      comment.reply.push(reply)

      comment.save(function(err, comment) {
        if (err) {
          console.log(err)
        }

        es.json({message:"Succeed"})
      })
    })
  }
  else {
    var comment = new Comment(_comment)

    comment.save(function(err, comment) {
      if (err) {
        console.log(err)
      }

      res.json({message:"Succeed"})
    })
  }
}
//get comments of an activity
exports.getComments=function(req,res){
  var activityId=req.params.id
  comment.find({activity:activityId},function(err,comments){
    if(err)
      console.log(err)
    else
      res.json({message:"Succeed",comments:comments})
  })
}