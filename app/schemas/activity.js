var mongoose = require('mongoose')
var ObjectId =mongoose.Schema.Types.ObjectId

var activitySchema = new mongoose.Schema({
	name:String,
	type:String,
	status:String,
	id:String,
	location:[{type:String}],
	description:String,
	time:String,
	tbdtime:[{type:String}],
	size:{ type: Number, default: 100 },
	quota:{ type: Number, default: 100 },
	news:[
		{
			content:String
		}
	],
	host:{
		id:{type: ObjectId, ref: 'user'},
		name:String
	},

	participants:[{
		id:{type: ObjectId, ref: 'user'},
		availdableAt:String,
	}]
})

activitySchema.set('collection', 'activity');

module.exports = activitySchema