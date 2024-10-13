const express = require('express');
const multer = require('multer');
const { renameSync } = require('fs');
const Product = require('../../models/product.js');
const Order = require('../../models/order.js');

const router = express.Router();

let fileUpload
let imgtype = ["png", "jpg", "jpeg"]
let storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "./public/img/clients_portrait_art")
    },
    filename :(req, file, cb) => {
        fileUpload = file
        cb(null, file.originalname)
    }
})
let upload = multer({storage:storage})

router.get('/:code', (req, res) => {
    Product.findAll(
        { where: {code: req.params.code} }
    ).then((product) => {
        let productByCode = product[0]
        productByCode.include = JSON.parse(productByCode.include)
        productByCode.likes = JSON.parse(productByCode.likes)
        res.render('user/Custom', { product : productByCode, user:req.session.user || "" });
    }).catch(err => {
        let productNotFound = {
            id      : 0,
            code    : "BBC2111",
            name    : "Product Not Found",
            price   : 0,
            include : ["-"],
            likes   : []
        }
        res.render('user/Custom', { product : productNotFound, user:req.session.user || "" });
    })
})

router.post('/:code', upload.single("portrait_art"), async (req, res) => {
    try {
        let date = Date.now()
        let imgPath
        if (fileUpload && imgtype.includes((fileUpload.mimetype).split('/').pop())) {
            renameSync(__dirname+'/../../public/img/clients_portrait_art/'+fileUpload.originalname, __dirname+'/../../public/img/clients_portrait_art/' + req.session.user.username + date +'.jpg')
            imgPath = req.session.user.username + date + '.jpg'
        }
        else if (fileUpload) {
            imgPath = fileUpload.originalname
        }
        Product.findOne({ where : { code : req.params.code } }).then((product) => {
            Order.create({
                username      : req.session.user.username,
                product_code  : req.params.code, 
                product_name  : product.name,
                product_price : product.price,
                balloon_type  : req.body.balloon_shape,
                balloon_color : req.body.balloon_color,
                ribbon_type   : req.body.ribbon_type,
                ribbon_color  : req.body.ribbon_color,
                accessories   : JSON.stringify(req.body.accessories),
                note          : req.body.note,
                cellophane    : req.body.cellophane_color,
                card_text     : req.body.card,
                portrait_art  : imgPath,
                user_name     : req.body.contact_name,
                user_phone    : req.body.contact_num,
                user_address  : req.body.address,
                user_payment  : req.body.payment_method,
                user_rek      : req.body.payaccount,
                user_date     : req.body.rec_date,
                voucher       : req.body.voucode,
                status        : "New Order"
            }).then((order) => {
                res.render('user/ThankYou', { user:req.session.user || "" })
            }).catch(err => {
                res.json("Can't place order");
            })
        }).catch(err => {
            res.json("Product Not Found");
        })
    }
    catch (err) {
        res.json({ status: 502, error: err });
    }
})

module.exports = router;