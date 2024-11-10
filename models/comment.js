const {sequelize, DataTypes} = require("./model.js");

const Comment = sequelize.define('comments', {
    product_code : DataTypes.STRING, 
    product_name : DataTypes.STRING,
    user_id      : DataTypes.STRING,
    username     : DataTypes.STRING,
    comment_text : DataTypes.STRING
})

module.exports = Comment;