# server

//


//json testing
GET /activity/all

// route user

/
POST /signup {name:String,password:"",email:String}     return {message:String}
POST /signin {email:String, password:String}  return {message:String,token:String}

/#
POST /activity/detail/:id {id:String,token:String}   
	 return {message:String,act:activity}

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


POST /activity/showmine
	{token:String}  
return {message:String,act:activity}
