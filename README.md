# server

//


//json testing
GET /activity/all

// route user

/
注册：
POST /signup {name:String,password:"",email:String}     return {message:String}
登陆：
POST /signin {email:String, password:String}  return {message:String,token:String}

/#
查询活动详情：
POST /activity/detail/:id {id:String,token:String}   
	 return {message:String,act:activity}

新建活动：
POST /activity/new 
	{name:String,
	host:String,
	type:String,
	status:String,
	location:String,
	description:String,
	time:String,
	tbdtime:[{String}],
	size:Number,
	quota:Number,token:String} 

return {message:String,act:activity}

修改活动：
POST /activity/edit
	{
	id:String,
	name:String,
	host:String,
	type:String,
	status:String,
	location:String,
	description:String,
	time:String,
	tbdtime:[{String}],
	size:Number,
	quota:Number,token:String}  
return {message:String,act:activity}

查询我的活动：
POST /activity/showmine
	{token:String}  
return {message:String,act:activity}
