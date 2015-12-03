# server
1. 登陆返回user信息
2. tbdTime改为startAt endAT

查询所有的活动：
GET /activity/all

注册：
POST /signup {name:String,password:"",email:String} return {message:String}

登陆：需返回user信息
POST /signin {email:String, password:String} return {message:String,token:String}

查询活动详情：
POST /activity/detail/:id {id:String,token:String}   
	 return {message:String,act:activity}

新建活动：
POST /activity/new 
	{name:String,
	type:String,
	status:String,
	location:String,[longtitude,latitude]    "location":"[12312.2131, 12312313]"
	description:String,
	time:String,
	startAt:String,
	endAt:String,
	size:Number,
token:String} 

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

To Do:


修改密码：


修改用户名字和电话：

参加活动：1.创建participant记录

退出活动：1.删除participant记录

投票：1.创建participant记录   2. 更新participant记录

view message： 


