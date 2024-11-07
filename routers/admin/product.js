const express = require('express');
const multer = require('multer');
const { renameSync, unlinkSync } = require('fs');
const Comment = require('../../models/comment.js');
const Product = require('../../models/product.js');

const router = express.Router();

let fileUpload
let imgtype = ["png", "jpg", "jpeg"]
let storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "./public/img/products")
    },
    filename :(req, file, cb) => {
        fileUpload = file
        cb(null, file.originalname)
    }
})
let upload = multer({storage:storage})

router.get('/edit/:code', (req, res) => {
    Product.findAll(
        { where: {code: req.params.code} }
    ).then((product) => {
        let productByCode = product[0]
        productByCode.include = JSON.parse(productByCode.include)
        productByCode.likes = JSON.parse(productByCode.likes)
        Comment.findAll(
            { where: {product_code: req.params.code} }
        ).then((allComments) => {
            res.render('admin/ProductEdit', { product : productByCode , comments : allComments, user : req.session.user || "" });
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
        res.render('admin/ProductEdit', { product : productNotFound , comments : [], user : req.session.user || "" });
    })
})

router.put('/edit/:code', (req, res) => {
    console.log(req.body.name);
    console.log(req.body.category);
    Product.update({
        category : req.body.category,
        name    : req.body.name, 
        price   : req.body.price, 
        include : JSON.stringify(req.body.desc)
    }, { where: {code: req.params.code}
    }).then((product) => {
        res.send("product "+req.params.code + " edited successfully")
    }).catch(err => {
        res.json({ status: 502, error: err });
    })
})

router.get('/deleted/:code', (req, res) => {
    Product.findAll(
        { where: {code: req.params.code} }
    ).then((product) => {
        let productByCode = product[0]
        productByCode.include = JSON.parse(productByCode.include)
        productByCode.likes = JSON.parse(productByCode.likes)
        Comment.findAll(
            { where: {product_code: req.params.code} }
        ).then((allComments) => {
            res.render('admin/ProductRepost', { product : productByCode , comments : allComments, user : req.session.user || "" });
        }).catch(err => {
            res.render('admin/ProductRepost', { product : productByCode , comments : [], user : req.session.user || "" });
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
        res.render('admin/ProductRepost', { product : productNotFound , comments : [], user : req.session.user || "" });
    })
})

router.post('/repost/:code', upload.single("image"), async (req, res) => {
    try {
        if (fileUpload && imgtype.includes((fileUpload.mimetype).split('/').pop())) {
            renameSync(__dirname+'/../../public/img/products/'+fileUpload.originalname, __dirname+'/../../public/img/products/' + req.params.code +'.jpg')
        }
        let listDesc = []
        if (typeof(req.body.desc) == 'object') {
            req.body.desc.forEach(desc => {
                if (desc.trim() != "")
                    listDesc.push(desc.trim())
            });
        }
        else {
            if (req.body.desc.trim() != "") listDesc.push(req.body.desc)
        }
        Product.update({
            category : req.body.category,
            code    : req.body.code,
            name    : req.body.name, 
            price   : req.body.price, 
            include : JSON.stringify(listDesc),
            status : 1
        }, { where: {code: req.params.code} }
        ).then((product) => {
            res.redirect('/product/comments/'+req.params.code)
        }).catch(err => {
            res.json({ status: 502, error: err });
        })
    }
    catch (err) {
        res.redirect('/product/comments/'+req.params.code)
    }
})

router.delete('/delete/:code', (req, res) => {
    Product.update({
        status : 0
    }, { where: {code: req.params.code} }
    ).then((product) => {
        res.send("product "+req.params.code+" temporary deleted")
    }).catch(err => {
        res.json({ status: 502, error: err });
    })
})

router.delete('/delete-permanent/:code', (req, res) => {
    Product.destroy({ where: {code: req.params.code} }).then((product) => {
        unlinkSync(__dirname+'/../../public/img/products/'+req.params.code+'.jpg')
        res.send("product "+ req.params.code + " permanently deleted")
    }).catch(err => {
        res.json({ status: 502, error: err });
    })
})

router.get('/:category/add', (req, res) => {
    Product.findOne(
        { where: {category: req.params.category} }
    ).then((product) => {
        res.render('admin/ProductAdd', { category : product.category, user : req.session.user || "" });
    }).catch(err => {
        res.render('admin/ProductAdd', { category : '', user : req.session.user || "" });
    })
})

router.post('/:category/add', upload.single("image"), async (req, res) => {
    try {
        Product.findOne({ where: { code: req.body.code }}).then((product) => {
            if (product == null) {
                if (fileUpload && imgtype.includes((fileUpload.mimetype).split('/').pop())) {
                    renameSync(__dirname+'/../../public/img/products/'+fileUpload.originalname, __dirname+'/../../public/img/products/' + req.body.code +'.jpg')
                }
                let listDesc = []
                if (typeof(req.body.desc) == 'object') {
                    req.body.desc.forEach(desc => {
                        if (desc.trim() != "")
                            listDesc.push(desc.trim())
                    });
                }
                else {
                    if (req.body.desc.trim() != "") listDesc.push(req.body.desc)
                }
                Product.create({
                    category : req.body.category,
                    code    : req.body.code,
                    name    : req.body.name, 
                    price   : req.body.price, 
                    include : JSON.stringify(listDesc)
                }).then((productNew) => {
                    res.redirect('/product/comments/' + req.body.code);
                }).catch(err => {
                    res.json({ status: 502, error: err });
                })
            }
        }).catch(err => {
            unlinkSync(__dirname+'/../../public/img/products/'+fileUpload.originalname)
            res.redirect('/products')
        })
    }
    catch (err) {
        res.json({ status: 502, error: err });
    }
})

router.delete('/comment/:id', (req, res) => {
    Comment.destroy({ where : { id : req.params.id } }).then((result) => {
        res.send("comment berhasil dihapus")
    }).catch(err => {
        res.json({ status: 502, error: err });
    })
})

module.exports = router;