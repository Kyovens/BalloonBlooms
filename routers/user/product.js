const express = require('express');
const Comment = require('../../models/comment.js');

const router = express.Router();

router.post('/comment/:code', (req, res) => {
    Comment.create(
        { 
            product_code : req.params.code, 
            user_id      : req.session.user.id,
            username     : req.session.user.username,
            comment_text : req.body.comment
        }
    ).then((result) => {
        res.redirect('/product/comments/'+req.params.code)
    }).catch(err => {
        res.json({ status: 502, error: err });
    })
})

router.delete('/comment/:id', (req, res) => {
    Comment.findOne({ where : { id : req.params.id } }).then((comment) => {
        if (comment.username == req.session.user.username) {
            Comment.destroy({ where : { id : req.params.id }
            }).then((result) => {
                res.send("Your comment deleted successfully")
            }).catch(err => {
                res.send("You can't delete somebody else comment");
            })
        }
    }).catch(err => {
        res.send("Can't find comment with id " + req.params.id)
    })
})

module.exports = router;