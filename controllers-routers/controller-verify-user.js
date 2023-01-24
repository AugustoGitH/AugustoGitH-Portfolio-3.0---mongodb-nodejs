const jwt = require("jsonwebtoken")

module.exports = {
    verifyToken(req, res, next){
        const token = req.cookies.authorizationToken
        if(!token) return res.status(401).redirect("/login")
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded)=>{
            if(err) return res.status(401).redirect("/login")
            next()
        })
    },
    verifyTokenRedirects(req, res, next){
        const token = req.cookies.authorizationToken
        if(!token) return next()
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded)=>{
            if(err) return next()
            res.status(200).redirect("/admin/auth/auth/painel")
        })
    }

}