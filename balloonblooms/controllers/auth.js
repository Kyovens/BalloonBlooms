const forAdmin = (req, res, next) => {
    let user = req.session.user || ""
    if (user.isAdmin)
        next()
    else
        res.redirect('/forbidden')
}

const forUser = (req, res, next) => {
    let user = req.session.user || ""
    if (user)
        next()
    else
        res.redirect('/forbidden')
}

module.exports = {forAdmin, forUser};