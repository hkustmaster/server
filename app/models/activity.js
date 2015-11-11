var mongoose = require('mongoose')
var activitySchema = require('../schemas/activity')
var activity = mongoose.model('activity',activitySchema)

module.exports = activity