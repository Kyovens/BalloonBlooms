const express = require('express');
const Product = require('../models/product.js');
const Comment = require('../models/comment.js');
const user_controller = require('../controllers/user.js');

const router = express.Router();

router.get("/login", user_controller.login)
router.get("/logout", user_controller.logout)
router.get("/signup", user_controller.signup)
router.post("/signup", user_controller.create)
router.post("/login", user_controller.auth)

router.get('/products', (req, res) => {
    Product.findAll().then((products) => {
        let allProducts = []
        let delProducts = []
        let allCategories = []
        products.forEach(product => {
            if (!allCategories.includes(product.category)) {
                allCategories.push(product.category)
                allProducts.push({
                    category : product.category,
                    items    : []
                })
                delProducts.push({
                    category : product.category,
                    items    : []
                })
            }
            let productByCategory = {
                id      : product.id,
                code    : product.code,
                name    : product.name,
                price   : product.price,
                include : JSON.parse(product.include),
                likes   : JSON.parse(product.likes)
            }
            if (product.status == 1) {  // masukkan ke list product active
                allProducts[allCategories.indexOf(product.category)].items.push(productByCategory)
            }
            else {  // masukkan ke list product non active/ backup delete
                delProducts[allCategories.indexOf(product.category)].items.push(productByCategory)
            }   
            
        });
        res.render('Product', { products : allProducts, deleted : delProducts, user:req.session.user || "" });
    }).catch(err => {
        res.json({ status: 502, error: err });
    })
})

router.get('/product/comments/:code', (req, res) => {
    Product.findAll(
        { where: {code: req.params.code} }
    ).then((product) => {
        let productByCode = product[0]
        productByCode.include = JSON.parse(productByCode.include)
        productByCode.likes = JSON.parse(productByCode.likes)
        Comment.findAll(
            { where: {product_code: req.params.code} }
        ).then((allComments) => {
            res.render('Comment', { product : productByCode , comments : allComments, user : req.session.user || "" });
        }).catch(err => {
            res.json({ status: 502, error: err });
        })
    }).catch(err => {
        let productNotFound = {
            id      : 0,
            code    : "BBC2111",
            name    : "Product Not Found",
            price   : 0,
            include : ["-"],
            likes   : []
        }
        res.render('Comment', { product : productNotFound , comments : [], user : req.session.user || "" });
    })
})


module.exports = router;