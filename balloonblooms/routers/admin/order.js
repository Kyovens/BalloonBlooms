const express = require('express');
const Order = require('../../models/order.js');
const Product = require('../../models/product.js');
const User = require('../../models/user.js');

const router = express.Router();

let errOrder = {
    id            : 0,            
    username      : "Who??",
    full_name     : "Who are you?",
    phone         : "?",
    product_code  : "BBC2111",  
    product_name  : "Product Not Found",
    product_price : 0, 
    include       : [],
    balloon_type  : "?",
    balloon_color : "?", 
    ribbon_type   : "?",
    ribbon_color  : "?",  
    accessories   : ["?"],
    note          : "?",          
    cellophane    : "?",
    card_text     : "?",     
    portrait_art  : "?",
    user_name     : "Who again??",     
    user_phone    : "?",
    user_address  : "Where??",  
    user_payment  : "No Money",
    user_rek      : "I don't know-Also don't know",      
    user_date     : Date.now(),
    voucher       : "x",       
    status        : "?",
    createdAt     : Date.now(),     
    updatedAt     : Date.now()
}

router.get('/order-list', (req, res) => {
    Order.findAll({ order : [['updatedAt', 'DESC']] }).then((allOrders) => {
        let cancelled = []
        let proccessed = []
        let finished = []
        User.findAll().then((users) => {
            allOrders.forEach((order) => {
                users.forEach((user) => {
                    if (order.username == user.username) {
                        order.full_name = user.name
                        order.phone = user.wa_num
                        if (order.status == "Cancelled") {
                            cancelled.push(order)
                        }
                        else if (order.status == "Finished") {
                            finished.push(order)
                        }
                        else {
                            proccessed.push(order)
                        }
                    }
                })
            })
            res.render('user/Order', { cancelled : cancelled , proccessed : proccessed , finished : finished , user : req.session.user || "" })

        }).catch(err => {
            res.render('user/Order', { cancelled : [] , proccessed : [] , finished : [] , user : req.session.user || "" })
        })
    }).catch(err => {
        res.render('user/Order', { cancelled : [] , proccessed : [] , finished : [] , user : req.session.user || "" })
    })
})

router.get('/details/:id', (req, res) => {
    Order.findOne({ where : { id : req.params.id }}).then((order) => {
        if (!order) throw err
        Product.findOne({ where : {code : order.product_code}}).then((product) => {
            User.findOne({where: {username : order.username}}).then((user) => {
                order.full_name = user.name
                order.phone = user.wa_num
                order.include = JSON.parse(product.include)
                order.accessories = order.accessories || ["-"]
                order.note = order.note || "-"
                order.card_text = order.card_text || "-"
                order.user_rek = order.user_rek || "?-?"
                order.portrait_art = order.portrait_art || "No Image or Maybe Wrong Image type"
                if (order.accessories != "-") {
                    order.accessories = JSON.parse(order.accessories)
                    if (typeof(order.accessories) != 'object')
                        order.accessories = [order.accessories]
                }
                if (order.include.length == 1) order.include = [order.include]
                res.render('user/OrderDetail', { order : order , user : req.session.user || "" })
            })
        })
    }).catch(err => {
        res.render('user/OrderDetail', { order : errOrder , user : req.session.user || "" })
    })
})

router.put('/update/:status/:id', (req, res) => {
    let status = ['New Order', 'On Proccessed', 'Ready to Get', 'Finished']
    let current = status.indexOf(req.params.status)
    Order.update({ status : status[current+1] }, { where : {id : req.params.id} }).then((order) => {
        res.send('Order #' + req.params.id + ' status successfully updated to  ' + status[current+1])
    }).catch(err => {
        res.json({ status: 502, error: err });
    })
})

module.exports = router;