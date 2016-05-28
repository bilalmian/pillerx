var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var request = require('request');
var tables = require('../models/models.js');

var Users = tables[0];
var Perscrip = tables[1];
var MedBase = tables[2];

var router = express.Router();

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

//DELETES PRESCRIPTION
app.post('/deletemed/:id', function(req,res){
	var mid = req.params.id;
	Perscrip.findOne({
		where: {id:mid},
	}).then(function(inst){
		inst.destroy()
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

module.exports = router;