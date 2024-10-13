const express = require('express');
const User = require('../../models/user.js');

const router = express.Router();

router.get('/', (req, res) => {
    User.findAll({
        order : ['username']
    }).then((users) => {
        let allAdmins = []
        let allUsers = []
        users.forEach((user) => {
            if (user.isAdmin) {
                allAdmins.push(user)
            }
            else {
                allUsers.push(user)
            }
        })
        res.render('admin/UserList', { admins : allAdmins , users : allUsers , user : req.session.user || "" });
    }).catch(err => {
        res.render('admin/UserList', { admins : [] , users : [] , user : req.session.user || "" });
    })
})

router.put('/to-user/:username', (req, res) => {
    User.findOne({ where : { username : req.params.username } }).then((user) => {
        if (user.username != 'balloonblooms') {
            User.update({ isAdmin : 0 }, { where : { username : req.params.username } }).then((results) => {
                res.send(req.params.username + ' bukan lagi Admin')
            }).catch(err => {
                res.json({ status: 502, error: err });
            })
        }
        else {
            res.send("Tidak dapat mengedit SuperAdmin")
        }
    }).catch(err => {
        res.json({ status: 502, error: err });
    })
})

router.put('/to-admin/:username', (req, res) => {
    User.update({ isAdmin : 1 }, { where : { username : req.params.username } }).then((results) => {
        res.send(req.params.username + ' bergabung sebagai Admin')
    }).catch(err => {
        res.json({ status: 502, error: err });
    })
})

router.delete('/delete-account/:id', (req, res) => {
    User.findOne({ where : { id : req.params.id } }).then((user) => {
        if (user.username != 'balloonblooms') {
            User.destroy({ where : { id : req.params.id } }).then((results) => {
                res.send("User " + req.params.id + ' berhasil dihapus')
            }).catch(err => {
                res.json({ status: 502, error: err });
            })
        }
        else {
            res.send("Tidak dapat menghapus SuperAdmin")
        }
    }).catch(err => {
        res.json({ status: 502, error: err });
    })
})

module.exports = router;