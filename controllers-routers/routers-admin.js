const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const router = express.Router()
const fetch = require("isomorphic-fetch")

const Project = require("../models/projetos")
const { TRUE } = require("node-sass")

async function handleDataGitApi(idGithub){
    let repesGit = await fetch("https://api.github.com/users/AugustoGitH/repos").then(res=> res.json().then(json=>json))
    let repGitFilter = await repesGit.filter(rep=> rep.id === Number(idGithub))
    let repGit = repGitFilter.length === 0 ? undefined : repGitFilter[0]

    let techsRep = repGit ? await fetch(repGit.languages_url).then(res=> res.json().then(json=> json)) : undefined
    let linkGitHubRep = repGit ? repGit.svn_url : undefined

    return {
        repLink: linkGitHubRep,
        techsPercent: techsRep
    }
}

router.get("/auth/auth/painel", (req, res)=> res.render("painel-port"))
router.post("/api/create-project", async (req, res)=>{
    let projects = await Project.find({})
    let project = new Project({...req.body, order: projects.length + 1, ...await handleDataGitApi(req.body.idGithub)})

    project.save()
    .then(status=> {
        return res.status(200).send({message: "Projeto criado com sucesso!", status})
    })
    .catch(error=>{
        console.log(error)
        return res.status(400).send({message: "Ocorreu um erro ao criar projeto!"})
    })
})

router.get("/api/get-projects", async (req, res)=>{
    try{
        let projects = await Project.find({})
        return res.status(200).send({message: "Projetos resgatados com sucesso!", data: projects, status: true})
    }
    catch(error){
        console.log(error)
        return res.status(401).send({message: "Projetos nãos resgatados!", status: false})
    }
})

router.get("/api/favorite-project/:id", async(req, res)=>{
    let idProject = req.params.id
    let project = await Project.findOne({_id: idProject})


    Project.updateOne({_id: idProject}, {favorite: !project.favorite, order: 1}).then(status=>{
        return res.status(200).send({message: `Projetos ${project.favorite ? "desfavoritado" : "favoritado"} com sucesso!`, status: true, favorite: !project.favorite})
    }).catch(err=>{
        console.log(err)
        return res.status(401).send({message: "Ocorreu um erro ao favoritar/desvaritar o projeto", status: false})
    })

})
router.get("/api/trash-project/:id", async(req, res)=>{
    let idProject = req.params.id
    Project.deleteOne({_id: idProject}).then(status=>{
        return res.status(200).send({message: "Projeto deletado com sucesso!", status: true })
    }).catch(err=>{
        return res.status(400).send({message: "Houve algum problema ao deletar projeto.",  status: false })
    })
})
router.get("/api/reload-gitId-project/:id", async(req, res)=>{
    let idProject = req.params.id
    let project = await Project.findOne({_id: idProject})
    Project.updateOne({_id: idProject}, {techsPercent: handleDataGitApi(project.idGithub).techsPercent}).then(status=>{
        return res.status(200).send({message: "Seus dados relacionados a API do Github foram atualizados!", status: true})
    }).catch(err=>{
        console.log(err)
        return res.status(401).send({message: "Ocorreu um erro ao atualizar seus dados relacionados a API do Github.", status: false})
    })
})

module.exports = router