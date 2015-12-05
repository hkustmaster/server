var mongoose = require('mongoose')
var ObjectId =mongoose.Schema.Types.ObjectId

var activitySchema = new mongoose.Schema({
	title:String,
	type:String,
	status:String,
	id:String,
	location:[{
    	coordinates : {
 			type: [Number]
		},
		index: '2dsphere'
	}
	description:String,
	time:String,
	startAt:String,
	endAt:String,
	size:{ type: Number, default: 100 },
	quota:{ type: Number, default: 100 },
	news:[
		{
			content:String
		}
	],
	host:{type: ObjectId, ref: 'user'},
	participants:[{
		id:{type: ObjectId, ref: 'user'},
		availdableAt:String,
	}],
	comments:[{type:ObjectId,ref:'comment'}],
	createAt: {
      type: Date,
      default: Date.now()
    }
})
activitySchema.set('collection', 'activity');

module.exports = activitySchema
