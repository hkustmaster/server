var mongoose = require('mongoose')

var activitySchema = new mongoose.Schema({
	id:String,
	name:String,
	host:String,
	time:String,
	type:String
})

activitySchema.set('collection', 'activity');

module.exports = activitySchema