const { Op } = require('sequelize');
const User = require('../models/user.js');

const login = (req, res, next) => {
    let msg = req.session.err || ""
    req.session.err = ""
    res.render('login', { user: req.session.user || "", message: msg })
}
const logout = (req, res, next) => {
    req.session.destroy()
    res.redirect('/')
}
const auth = (req, res, next) => {
    const data = {
        username : req.body.username,
        password : req.body.password
    };
    req.session.err = ""
    User.findOne({ where: {[Op.or] : [{ username: data.username }, { wa_num: data.username }] }}).then(results => {
        if (!results) {
            req.session.err = 'Incorrect email or password.'
            res.redirect('/login')
        }
        else if (data.password != results.password) {
            req.session.err = 'Incorrect password.'
            res.redirect('/login')
        }
        else {
            req.session.user = results
            res.redirect('/')
        }
    }).catch(err => {
        req.session.err = err
        res.redirect('/login')
    });
}
const signup = (req, res, next) => {
    let msg = req.session.err || ""
    req.session.err = ""
    res.render('signup', { user: req.session.user || "", message: msg })
}
const create = (req, res, next) => {
    const data = {
        username : req.body.yourname.split(' ')[0] + req.body.wanum.slice(-4),
        name     : req.body.yourname,
        wa_num   : req.body.wanum,
        password : req.body.password
    }
    User.findOne({ where: { username: data.username } }).then(results => {
        if (results) {
            req.session.err = "Username has been register. Please change your name/ phone number."
            res.redirect('/signup')
        }
        else {
            User.create(data).then((results) => {
                res.render('login', { user: data || "", message: "Account successfully created. Please login again." })
            }).catch(err => {
                req.session.err = err
                console.log(err);
                res.redirect('/signup')
            })
        }
    }).catch(err => {
        req.session.err = err
        res.redirect('/signup')
    });
}

module.exports = { login, logout, auth, signup, create };