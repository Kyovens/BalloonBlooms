const express = require('express');
const Product = require('../../models/product.js');

const router = express.Router();

router.get('/', (req, res) => {
    Product.findAll().then((products) => {
        let likedProducts = []
        products.forEach(product => {
            product.include = JSON.parse(product.include)
            product.likes = JSON.parse(product.likes)
            if (product.likes.includes(req.session.user.username)) {
                likedProducts.push(product)
            }
        });
        res.render('user/Wishlist', { product:likedProducts, user:req.session.user || "" })
    }).catch(err => {
        res.render('user/Wishlist', { product:[], user:req.session.user || "" })
    })
})

router.post('/add/:code', (req, res) => {
    Product.findOne({ where: {code: req.params.code} }).then((product) => {
        let likes = JSON.parse(product.likes)
        likes.push(req.session.user.username)
        Product.update({
            likes : JSON.stringify(likes)
        }, { where: {code: req.params.code}
        }).then((product) => {
            res.send("Successfully added to wishlist")
        }).catch(err => {
            res.json({ status: 502, error: err });
        })
    })
})

router.delete('/remove/:code', (req, res) => {
    Product.findOne({ where: {code: req.params.code} }).then((product) => {
        let likes = JSON.parse(product.likes)
        likes.splice(likes.indexOf(req.session.user.username), 1)
        Product.update({
            likes : JSON.stringify(likes)
        }, { where: {code: req.params.code}
        }).then((product) => {
            res.send("Successfully remove from wishlist")
        }).catch(err => {
            res.json({ status: 502, error: err });
        })
    })
})

module.exports = router;