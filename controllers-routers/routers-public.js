const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const router = express.Router()
const controllerVerify = require("./controller-verify-user")
const Project = require("../models/projetos")

router.get("/", (req, res)=> {
    res.render("home_page-port", {admin: req.cookies.authorizationToken ? true : false})
})
router.get("/login", controllerVerify.verifyTokenRedirects, (req, res)=> res.render("login-port") )


router.get("/public/api/get-projects", async(req, res)=>{
    try{
        let projects = await Project.find({})
        return res.status(200).send({message: "Projetos resgatados com sucesso!", data: projects, status: true})
    }
    catch(error){
        console.log(error)
        return res.status(401).send({message: "Projetos nãos resgatados!", status: false})
    }
})

router.post("/public/auth/api/login", (req, res)=>{
    const {nameAdmin, password} = req.body
    if(nameAdmin !== process.env.NOME_ADMIN) return res.status(401).send({message: "Login não aprovado! Nome de usuário ou senha incorretos!", status: false})
    let passAndUserMatch = bcrypt.compareSync(password, process.env.PASSWORD_ADMIN)
    if(!passAndUserMatch) return res.status(401).send({message: "Login não aprovado! Nome de usuário ou senha incorretos!", status: false})

    const tokenJWT = jwt.sign({usernameAdmin: process.env.NOME_ADMIN, exp: Math.floor(Date.now() / 1000) + (60 * 60)}, process.env.TOKEN_SECRET)
    res.cookie("authorizationToken", tokenJWT, {
        secure: true,
        httpOnly: true,
    })
    
    res.status(200).send({message: "Login verificado! ", status: true})
})

module.exports = router