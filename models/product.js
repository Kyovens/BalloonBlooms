const {sequelize, DataTypes} = require("./model.js");

const Product = sequelize.define('products', {
    category : DataTypes.STRING,
    code     : DataTypes.STRING, 
    name     : DataTypes.STRING,
    price    : DataTypes.INTEGER,
    include  : DataTypes.STRING,  // hrsnya array, tp mysql
    likes    : DataTypes.STRING,  // tdk mendukung array, jd bs la diatur di js
    status   : DataTypes.TINYINT
})

module.exports = Product;