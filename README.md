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

查询我的所有活动包括自己发起的和参加的：
POST /activity/showmine
	{token:String}  
return {message:String,act:activity}

Show user info:
POST /user/detail
{token:,id:}   //the id is whose id you want to search for
return {message:, user{}}

To Do:
Check NearBy Events
POST /activity/showaround
{token:"",distance:""}  distance is in metres

修改密码：
POST /user/edit
{password:"23123",token:""}

修改用户名字和电话：


参加活动：1.创建participant记录
POST /activity/join
{token:"",id:""}
return {message:}


退出活动：1.删除participant记录
POST /activity/leave
{token:"",id""}
return {message:}

vote:
POST /activity/vote
{token:"",actid:"",vote:String}
return {message:}


view comment：
POST /comment/list
 {token:"",id:""}
return {message:}

post comment:
POST /comment/list
 {token:"",id:"",content:""}
return {message:}


獲取頭像：POST

<form action="http://sigmoid.xyz:3000/user/getavatar" method="post">
<input type="text" name="token">
<input type="submit" value="Upload">
</form>

上傳頭像
<form action="http://sigmoid.xyz:3000/user/avatar" enctype="multipart/form-data" method="post">
<input type="text" name="token">
<input type="text" name="ext" value="jpg">
File <input type="file" name="picc" accept="image/*">

<input type="submit" value="Upload">
</form>
