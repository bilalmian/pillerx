var express = require('express');
var mysql = require('mysql');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');
// var sequelize = new Sequelize('medications','root');
var path = require('path');
var bcrypt = require('bcrypt');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var sequelize = new Sequelize('mysql://irri1wgv9ywf9sh6:ya35g8wzdcut6mvf@g8r9w9tmspbwmsyo.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/hqj0wz9mwllcl3k6?sslca=rds-combined-ca-bundle.pem&ssl-verify-server-cert', {
 define: { timestamps: false },
 dialect: 'mysql',
 pool: {
     max: 5,
     min: 0,
     idle: 10000
 },

})
 
var PORT = process.env.NODE_ENV || 3000;

var app = express();

app.use(session({ secret: 'app', cookie: { maxAge: 60000 }}));
app.use(cookieParser());
app.use(bodyParser.json());
var exphbs= require("express-handlebars");
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));


var Users= sequelize.define('clients', {
	id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
	first: Sequelize.STRING, 
	last: Sequelize.STRING, 
	street: Sequelize.STRING, 
	city: Sequelize.STRING, 
	state: Sequelize.STRING, 
	zip: Sequelize.STRING, 
	phone_number: Sequelize.STRING, 
	email: Sequelize.STRING, 
	password_hash: Sequelize.STRING
});

var Perscrip = sequelize.define('prescriptions',{
	id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
	medname: Sequelize.STRING, 
	dose: Sequelize.STRING, 
	time_of_day: Sequelize.STRING, 
	with_food: Sequelize.STRING,
	date_filled: Sequelize.STRING, 
	amount_days: Sequelize.STRING, 
	refills: Sequelize.STRING, 
	prescribing_doctor: Sequelize.STRING, 
	pharm_name: Sequelize.STRING, 
	directions: Sequelize.TEXT, 
	notes: Sequelize.TEXT,
	rxuid: Sequelize.STRING, 
});



Perscrip.belongsTo(Users);

var MedBase = sequelize.define('rxnconsos', {

	RXCUI: {
		type: Sequelize.STRING,
		allowNull: false,
		// get: function(){
		// 	var str = this.getDataValue('STR');
		// 	return this.getDataValue(str);
		// },
	},
	STR: {
		type: Sequelize.STRING,
		allowNull: false,
		// set: function(val){
		// 	this.setDataValue('title');
		// },
	}
},{
	timestamps: false
});


MedBase.sync();
Users.sync();
Perscrip.sync();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', function(req, res){
	//res.send("Welcome to the Star Wars Page!")
	console.log(req.session.user_id);
	res.sendFile(path.join(__dirname + '/index.html'));
})
app.get('/dashboard', function(req, res){
	//res.send("Welcome to the Star Wars Page!")
	console.log(req.session.user_id);
	res.sendFile(path.join(__dirname + '/dashboard.html'));
})


app.post('/login', function(req,res){
	Users.findOne({
		where:{email:req.body.logEmail}
	}).then(function(user){
		console.log("here it iss!", user);
		if(user == null){
			res.send('No account')
		}else{
			console.log("logging in.....")
				bcrypt.compare(req.body.logPass, user.password_hash, function(err, result){
					if (result == true){
						console.log("success!!!!");
						req.session.logged_in = true;
						req.session.user_id = user.id;
						req.session.user_email = user.email;
						// res.redirect('/');

						res.redirect('/dashboard')

						
					}else{res.send('Wrong password!')}
				})
		}
	})
});



app.post('/newuser', function(req,res){
	console.log(req.body)

	Users.findAll({
		where: {email: req.body.email}
	}).then(function(userArray){
		console.log(userArray);
		if (userArray.length > 0){
			console.log(Users)
			res.send("Already have this email")
			//FIX THIS AND MAKE IT JUST SEND OUT AN ALERT OR SOMETHING
		}else{
			bcrypt.genSalt(10, function(err, salt){
				bcrypt.hash(req.body.pass, salt, function(err,hash){
					console.log(hash);
					Users.create({
						first:req.body.first_name,
						last: req.body.last_name,
						street:req.body.street,
						city: req.body.city,
						state:req.body.state,
						zip:req.body.zip,
						phone_number: req.body.phone_number,
						email: req.body.email,
						password_hash: hash
					}).then(function(user){

						req.session.logged_in = true;
						req.session.user_id = user.id;
						req.session.user_email = user.email;
						res.json(user);

						res.redirect('/')
					})
				})
			})
		}
	})
});

//RETURN DETAILED SPECIFC PRESCRIPTION INFO

app.post('/call/:id', function(req,res){
	var pid = req.params.id;
	console.log("the id is ..." + pid);
	Perscrip.findOne({
		where: {id: pid},
		raw: true 
	}).then(function(inst){
			res.json(inst);
	})
});

//UPDATES USER INFO;RETURNS NEW INFO

app.post('/updateuser', function(req,res){
	var sid= req.session.user_id
	Users.update({
		first: req.body.first,
		last: req.body.last,
		email: req.body.email
	},{
		where: {id:sid}
	}).then(function(){
		Users.findOne({
			where: {id:sid}
		}).then(function(inst){
			res.json(inst)
		})
	})
});


//DELETES PRESCRIPTION
app.post('/deletemed/:id', function(req,res){
	var mid = req.params.id;
	Perscrip.findOne({
		where: {id:mid},
	}).then(function(inst){
		console.log(inst);
		inst.destroy()
	})
})

app.post('/doctors', function(req,res){
	var we= req.params.id;
	Perscrip.findAll({
		where: {client_id:we}
	}).then(function(inst){
		console.log(inst);
		res.json(inst);

	})
})

//ADDS PRESCRIPTION
app.post('/prescription', function(req, res) {
	var name = req.body.med_name;
	console.log(name); 
	MedBase.findAll({
		where: {STR: name},
		limit: 1,
		attributes: ['STR', 'RXCUI'],
		raw: true
	}).then(function(inst){
		console.log(inst);
		if (inst.length>0){
			results = inst[0].RXCUI;
		}else{results= 'undefined'};
		console.log('the RXCUI results are: ')
		console.log(results);
		var using = req.session.user_id;
		var x;
		if (req.body.tOd !== undefined){
			x = req.body.tOd.join();
			}else{x=0};

		Perscrip.create({
			medname: req.body.med_name, 
			dose: req.body.dose, 
			time_of_day: x,
			with_food: req.body.food, 
			date_filled: req.body.filled, 
			amount_days: req.body.length, 
			refills: req.body.refLeft, 
			prescribing_doctor: req.body.doc, 
			pharm_name: req.body.pharm, 
			directions: req.body.directions, 
			notes: req.body.notes, 
			clientId: using,
			rxuid: results,
			}).then(function(inst){
					res.json(inst);

	})
	});
});
//PART OF THE CHECKING FOR INTERACTIONS FEATURE
app.post('/check', function(req,res){
	var using = req.session.user_id;
	console.log("Hit Check Route")
	console.log(using);
	Perscrip.findAll({
		where: {clientId: using},
		attributes: ['medname','rxuid']
	}).then(function(respond){
		res.json(respond);
	})
});

//GIVES A COMPLETE LIST OF ALL PRESCRIPTIONS FOR CURRENT USER
app.post('/printall', function(req,res){
	var using = req.session.user_id;
	console.log(using);
	Perscrip.findAll({
		where: {clientId: using}
	}).then(function(respond){
		res.json(respond);
	})
})


app.listen(PORT, function() {
  console.log("Listening on port %s", PORT);
});

