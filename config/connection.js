var Sequelize = require('sequelize');

var sequelize = new Sequelize('medications','root');

// var sequelize = new Sequelize('mysql://irri1wgv9ywf9sh6:ya35g8wzdcut6mvf@g8r9w9tmspbwmsyo.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/hqj0wz9mwllcl3k6?sslca=rds-combined-ca-bundle.pem&ssl-verify-server-cert', {
//  define: { timestamps: false },
//  dialect: 'mysql',
//  pool: {
//      max: 5,
//      min: 0,
//      idle: 10000
//  },

// })

module.exports = sequelize;