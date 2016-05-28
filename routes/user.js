var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var request = require('request');
var tables = require('../models/models.js');

var Users = tables[0];
var Perscrip = tables[1];
var MedBase = tables[2];

var router = express.Router();

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

module.exports = router;
