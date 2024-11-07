const {sequelize, DataTypes} = require("./model.js");

const User = sequelize.define('users', {
    username : DataTypes.STRING,
    password : DataTypes.STRING,
    name     : DataTypes.STRING,
    wa_num   : DataTypes.STRING,
    isAdmin  : DataTypes.BOOLEAN
})

module.exports = User;