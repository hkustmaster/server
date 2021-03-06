var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var SALT_WORK_FACTOR = 10
var ObjectId =mongoose.Schema.Types.ObjectId

var userSchema = new mongoose.Schema({
  name: String,
  password: String,
  // 0: nomal user
  // 1: verified user
  // 2: professonal user
  // >10: admin
  // >50: super admin
  role: {
    type: Number,
    default: 0
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  },
  email:String,
  gender:String,
  phone:String,
  avatar:{type: ObjectId}

})

userSchema.pre('save',function(next){
	var user=this;
	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		if(err)
			return  next(err)
		bcrypt.hash(user.password,salt,function(err,hash){
			console.log('password='+user.password)
			console.log('salt='+salt)
			if (err) return next(err)
			user.password=hash
			next() 

		})

	})
});
userSchema.methods = {
  comparePassword: function(_password, cb) {
    bcrypt.compare(_password, this.password, function(err, isMatch) {
      if (err) return cb(err)

      cb(null, isMatch)
    })
  },
  saltpwd: function(password) {
    var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    var hash = bcrypt.hashSync(password, salt);
    return hash
  }
}

userSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

userSchema.set('collection', 'users');

module.exports = userSchema
