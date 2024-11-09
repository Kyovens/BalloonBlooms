const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize("web_chat", "root", "", {  // db name, username, password
    host    : 'localhost', 
    dialect : 'mysql',
    password: 'data#S00work'
});

module.exports = {sequelize, DataTypes}