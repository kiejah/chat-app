//add user(id,name,room)
//delete use(id)
//getuser(id): returns an object
//getUserlist(room)

class Users{
	constructor(){
		this.users=[];
	}
	addUser(id,d_name,room){
		var user= {id,d_name,room};
		this.users.push(user);
		return user;

	}
	removeUser(id){
		var user= this.getUser(id);
		if(user){
			this.users= this.users.filter((user)=> user.id !== id);
		}
		return user;

	}
	getUserName(dname){
		var user= this.users.filter(function(_user) {
			return _user.d_name=== dname;
		});

		return user[0];

	}
	getUser(id){
		var user= this.users.filter(function(_user) {
			return _user.id=== id;
		});

		return user[0];

	}
	getUserList(room){
		var users= this.users.filter(function(user) {
			return user.room===room;
		});
		var namesArray= users.map(function(user) {
			return user.d_name;
		});

		return namesArray;
	}
}

module.exports={Users}