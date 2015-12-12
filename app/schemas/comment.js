var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CommentSchema = new mongoose.Schema({
  activity: {type: ObjectId, ref: 'activity'},
  from: {
    id:{type: ObjectId, ref: 'user'},
    name:String
  },
  reply: [{
    from: {type: ObjectId, ref: 'user'},
    to: {type: ObjectId, ref: 'user'},
    content: String
  }],
  content: String,
  createAt: {
    type: Date,
    default: Date.now()
  }
})

// var ObjectId = mongoose.Schema.Types.ObjectId
CommentSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = Date.now()
  }
  next()
})

CommentSchema.statics = {
  fetch: function(id,cb) {
    return this
      .find({activity:id})
      .sort('createAt')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = CommentSchema