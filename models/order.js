const {sequelize, DataTypes} = require("./model.js");

const Order = sequelize.define('orders', {
    username      : DataTypes.STRING,
    product_code  : DataTypes.STRING, 
    product_name  : DataTypes.STRING,
    product_price : DataTypes.INTEGER,
    balloon_type  : DataTypes.STRING,
    balloon_color : DataTypes.STRING,
    ribbon_type   : DataTypes.STRING,
    ribbon_color  : DataTypes.STRING,
    accessories   : DataTypes.STRING,  // harusnya array, tp mysql gbs array, jd nnti diatur di js
    note          : DataTypes.STRING,
    cellophane    : DataTypes.STRING,
    card_text     : DataTypes.STRING,
    portrait_art  : DataTypes.STRING,
    user_name     : DataTypes.STRING,
    user_phone    : DataTypes.STRING,
    user_address  : DataTypes.STRING,
    user_payment  : DataTypes.STRING,
    user_rek      : DataTypes.STRING,
    user_date     : DataTypes.DATE,
    voucher       : DataTypes.STRING,
    status        : DataTypes.STRING
})

module.exports = Order;