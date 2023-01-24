require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser')
const cors = require("cors")
const PORT = 3000  


const routersPublic = require("./controllers-routers/routers-public")
const routerAdmin = require("./controllers-routers/routers-admin")
const controllerVerify = require("./controllers-routers/controller-verify-user")

app.use("/public", express.static("public"))
app.use(cookieParser())
app.use(bodyParser.json({limit: '99999mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '99999mb', extended: true}))

app.set("view engine", "ejs")



app.use("/", routersPublic)
app.use("/admin", controllerVerify.verifyToken, routerAdmin)



mongoose.connect(process.env.MONGO_CONNECTION_URL, (err)=> err ? console.log(err) : console.log("------------> BANCO DE DADOS CARREGADO"))

app.listen(PORT, ()=> console.log("Servidor rodando na porta " + PORT))