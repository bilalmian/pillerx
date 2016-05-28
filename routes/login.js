var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var request = require('request');
var tables = require('../models/models.js');
var handlebars = require('handlebars');
var Users = tables[0];
var Perscrip = tables[1];
var MedBase = tables[2];

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res){
	console.log(req.session.user_id);
	res.sendFile(path.join(__dirname + 'index-layout.html'));
});

router.get('/dashboard', function(req, res){
	
	console.log("got to dashboard");

	res.sendFile(path.join(__dirname + '/index-layout.html'));
});

handlebars.registerHelper('meds', function(context, options){
	
	var name = this.medname;
	return name;

})


router.get('/page', function(req, res){

	res.render('page');
});


router.post('/login', function(req,res){
	console.log(req.body);
	Users.find({
		where:{email:req.body.logEmail}
	}).then(function(user){
		console.log("here it iss!", user);
		if(user == null){
			res.send('No account found under this email')
		}else{
			console.log("logging in.....")
				bcrypt.compare(req.body.logPass, user.password_hash, function(err, result){
					if (result == true){
						console.log("success!!!!");
						req.session.logged_in = true;
						req.session.user_id = user.id;
						req.session.user_email = user.email;
						req.session.user = user;

						res.redirect('/dashboard');
					}else {
						res.send('Wrong password!')
					}
				})
		}
	})
});



router.post('/newuser', function(req,res){
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

						res.redirect('/dashboard')
					})
				})
			})
		}
	})
});

router.post('/prescription', function(req, res) {
	console.log("THIS IS THE BODY: " + req.body)
	var name = req.body.med_name;
console.log(name); 
// res.json(req.body);


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
		
		console.log(results);
		var using = req.session.user_id;
		var x;
		if (req.body.tOd !== undefined){
			x = req.body.tOd.join();
			console.log(x);
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
					console.log(inst)
					res.json(inst);
					// res.send('GOT IT');
			})
	}); 
});

//RETURN DETAILED SPECIFC PRESCRIPTION INFO

router.post('/call/:id', function(req,res){
	var pid = req.params.id;
	console.log("the id is ..." + pid);
	Perscrip.findOne({
		where: {id: pid},
		raw: true 
	}).then(function(inst){
			res.json(inst);
	})
});


router.post('/updateuser', function(req,res){
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
router.post('/deletemed/:id', function(req,res){
	var mid = req.params.id;
	Perscrip.findOne({
		where: {id:mid},
	}).then(function(inst){
		inst.destroy()
	})
});

//PART OF THE CHECKING FOR INTERACTIONS FEATURE
router.post('/check', function(req,res){
	var using = req.session.user_id;
	console.log(using);
	Perscrip.findAll({
		where: {clientId: using},
		attributes: ['medname','rxuid']
	}).then(function(respond){
		res.json(respond);
	})
});
router.post("/getinfo", function(req,res){
	var user = req.session.user_id;
	Users.findOne({
		where: {id: user}
	}).then(function(respond){
		res.json(respond)
	})
})
//GIVES A COMPLETE LIST OF ALL PRESCRIPTIONS FOR CURRENT USER
router.post('/printall', function(req,res){
	var using = req.session.user_id;
	console.log("Printing all...")
	console.log(using);
	Perscrip.findAll({
		where: {clientId: using}
	}).then(function(respond){
		console.log(respond)
		res.json(respond);
	})
});


module.exports = router;
