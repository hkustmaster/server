var mongoose = require('mongoose')
var ObjectId =mongoose.Schema.Types.ObjectId

var activitySchema = new mongoose.Schema({
	id:String,
	name:String,
	host:String,
	type:String,
	status:String,
	hashid:String,
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

	participants:[{type: ObjectId, ref: 'user'}],

	time:{
		beginAt:{
			type: Date
  		},
  		endAt:{
  			type: Date
  		}
	}
})

activitySchema.set('collection', 'activity');

module.exports = activitySchema