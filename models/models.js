var Sequelize = require("sequelize");

var sequelizeConnection = require("../config/connection.js");

var Users = sequelizeConnection.define('clients', {
	id: {
		type: Sequelize.INTEGER, 
		primaryKey: true, 
		autoIncrement: true,
		allowNull: false
	},
	first: {
		type: Sequelize.STRING,
		allowNull: false
	},
	last: {
		type: Sequelize.STRING,
		allowNull: false
	}, 
	street: {
		type: Sequelize.STRING,
		allowNull: false
	}, 
	city: {
		type: Sequelize.STRING,
		allowNull: false
	},
	state: {
		type: Sequelize.STRING,
		allowNull: false
	},
	zip: {
		type: Sequelize.STRING,
		allowNull: false
	},
	phone_number: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false
	},
	password_hash: {
		type: Sequelize.STRING,
		allowNull: false
	},
});

var Perscrip = sequelizeConnection.define('prescription', {
	id: {
		type: Sequelize.INTEGER, 
		primaryKey: true, 
		autoIncrement: true,
		allowNull: false
	},
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
});

Perscrip.belongsTo(Users);

var MedBase = sequelizeConnection.define('rxnconsos', {

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

Users.sync();
Perscrip.sync();
MedBase.sync();

module.exports = [Users, Perscrip, MedBase];