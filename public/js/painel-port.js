function handleInputFileImage(){
    let label = document.querySelector(".input-image-label")
    label.addEventListener("change", ev=>{
        let input_value = ev.target.files[0]
        if(input_value){
            let reader = new FileReader()
            reader.addEventListener("load", ev=> {
                let container = document.querySelector(".container-sample-image")
                let modelContImage = `
                    <div class="sample-image">
                        <img src="${ev.target.result}">
                    </div>
                `
                container.innerHTML = modelContImage
            })
            reader.readAsDataURL(input_value)
        }
    })
}

function handleCheckboxes(){
    let markClasse = "mark-check"
    let checkboxes_containers = document.querySelectorAll("[checkboxes-selected]")
    checkboxes_containers.forEach(checkboxesC=>{
        let stateToggle = checkboxesC.attributes["selected-all"] ? true : false
        let checkboxes = checkboxesC.querySelectorAll("[checkbox]")
        let markClasseStyle = Array.from(checkboxes).find(checkboxF=> checkboxF.classList.contains(markClasse)).classList[1]
        checkboxes.forEach((checkbox, indexC, arrayC)=>{
            checkbox.addEventListener("click", ev=>{
                if(stateToggle){
                    ev.target.classList.toggle(markClasseStyle)
                    ev.target.classList.toggle(markClasse)
                }else{
                    arrayC.forEach(checkboxB=> checkboxB.classList.remove(markClasse, markClasseStyle))
                    ev.target.classList.add(markClasse, markClasseStyle)
                }
            })
        })
    })
}

function getCheckedBoxes(){
    let markClasse = "mark-check"
    let responseCheckboxes = {}
    let checkboxes_containers = document.querySelectorAll("[checkboxes-selected]")
    checkboxes_containers.forEach(checkboxesC=>{
        let stateToggle = checkboxesC.attributes["selected-all"] ? true : false
        let checkboxes = checkboxesC.querySelectorAll("[checkbox]")
        let nameType = checkboxesC.id.split("-")[1]
        if(stateToggle){
            responseCheckboxes[nameType] = Array.from(checkboxes).filter(checkboxF=> checkboxF.classList.contains(markClasse)).map(checkboxM=>checkboxM.id)
        }
        else{
            responseCheckboxes[nameType] = Array.from(checkboxes).find(checkboxF=> checkboxF.classList.contains(markClasse)).id
        }
    })
    return responseCheckboxes
}

function checkEmptyCheckboxes(){
    let markClasse = "mark-check"
    let checkboxes_containers = document.querySelectorAll("[checkboxes-selected]")
    let verifysOb = {}
    checkboxes_containers.forEach(checkboxesC=>{
        let nameType = checkboxesC.id.split("-")[1]
        let nameTypeSection = checkboxesC.parentNode.querySelector("h2").innerHTML
        let checkboxes = checkboxesC.querySelectorAll("[checkbox]")
        let checkboxesComplete = 0
        checkboxes.forEach(checkbox=>{
            checkbox.classList.contains(markClasse) ? checkboxesComplete++ : checkboxesComplete
            verifysOb[nameType] = {nameSection: nameTypeSection, checkboxesEmpty: checkboxesComplete} 
        })
    })
    return verifysOb
}

function handleEventsButton(){
    let button = document.querySelector("#button-submit-project")
    let nameProject = document.querySelector("#name-project")
    let urlProject = document.querySelector("#url-project")
    let idGithub = document.querySelector("#idGit-project")

    button.addEventListener("click", async ()=>{
        let imgSrc = document.querySelector(".sample-image img") || ""
        if(!nameProject.value) return popUpAlertInputs("O input <mark>Nome do projeto</mark> está vazio!")
        if(!urlProject.value) return popUpAlertInputs("O input <mark>Link do projeto</mark> está vazio!")
        if(!idGithub.value) return popUpAlertInputs("O input <mark>Id do projeto no Github</mark> está vazio!")
        if(!imgSrc) return popUpAlertInputs("Nenhuma imagem foi definida!")
        for(let keyType in checkEmptyCheckboxes()){
            if(checkEmptyCheckboxes()[keyType].checkboxesEmpty === 0) return popUpAlertInputs(`Não foi marcado nenhuma caixa em <mark>${checkEmptyCheckboxes()[keyType].nameSection}</mark>`)
        }


        sendProjectDataThroughAPI({...getCheckedBoxes(), ...{
            name: nameProject.value,
            url: urlProject.value,
            idGithub: idGithub.value,
            cover: imgSrc.src
        }})
    })
}
async function sendProjectDataThroughAPI(responseObj){

    let options = {
        method: "POST", 
        headers: new Headers({"Content-Type":"application/json"}),
        body: JSON.stringify({...responseObj})
    }
    try{
        let responseApi = await fetch("/admin/api/create-project", options).then(res=> res.json().then(json=>json))
        popUpAlertInputs(responseApi.message, ()=> location.reload())
    }catch(err){
        console.log(err)
        popUpAlertInputs("Ocorreu um erro na parte do servidor!")
    }
}

function popUpAlertInputs(message, cb){
    let alertPopUp = document.createElement("div")
    alertPopUp.classList.add("popUp-alert", "opacity0")


    document.body.classList.add("blockScreen")


    let cardPopUp = document.createElement("div")
    cardPopUp.classList.add("card-popUp")
    alertPopUp.appendChild(cardPopUp)

    let text = document.createElement("h4")
    text.innerHTML = message
    cardPopUp.appendChild(text)

    let button = document.createElement("button")
    button.innerHTML = "Fechar"
    button.addEventListener("click", ()=>{
        document.body.removeChild(alertPopUp)
        document.body.classList.remove("blockScreen")
        cb ? cb() : 0
    })
    cardPopUp.appendChild(button)


    document.body.appendChild(alertPopUp)
    setTimeout(()=> alertPopUp.classList.remove("opacity0"), 200)
}
async function retrieveProjectDataFromAPI(){
    let projetos = await fetch("/admin/api/get-projects").then(res=>res.json().then(json=>json.data))
    createProjectsCards(projetos)
}
function createProjectsCards(array){
    let cardsHTML = ""
    array.forEach(card=>{
        cardsHTML += `
        <li class="projects ${card.favorite ? "border-favorite" : ""}">
            <div class="project-img-container">
                <img src="${card.cover}">
            </div>
            <article>
                <ul id="control-project-list">
                    <li id="favorite-button" ${card.favorite ? `class="icon-favorite"`: ""} onclick="favoriteProject(this, '${card._id}')"><i class='bx bxs-star'></i></li>
                    <li id="trash-button" onclick="trashProject(this,'${card._id}')"><i class='bx bxs-trash'></i></li>
                    <li id="reload-git-button" onclick="reloadGitProject('${card._id}')"><i class='bx bx-git-repo-forked'></i></li>
                </ul>
                <h3>${card.type.split("-").map(word=> word[0].toUpperCase() + word.substring(1, word.length)).join(" ")}</h3>
                <h1>${card.name}</h1>
                <ul>
                    ${
                        card.techs.map(tech=>`<li>${tech}</li>`).toString().replace(/,/g, "")
                    }
                </ul>
                <a href="${card.url}">${card.url}</a>
                <p>${card.idGithub}</p>
            </article>
        </li>
        `
    })
    document.querySelector(".projects-list").innerHTML = cardsHTML
}



async function favoriteProject(button, id){
    let responseAPI = await fetch(`/admin/api/favorite-project/${id}`).then(res=>res.json().then(json=>json))
    popUpAlertInputs(responseAPI.message, ()=>{
        let project = button.parentNode.parentNode.parentNode
        if(responseAPI.favorite){
            project.classList.add("border-favorite")
            button.classList.add("icon-favorite")
        }
        else{
            project.classList.remove("border-favorite")
            button.classList.remove("icon-favorite")
        }
    })
}
async function trashProject(button,id){
    let responseAPI = await fetch(`/admin/api/trash-project/${id}`).then(res=>res.json().then(json=>json))
    popUpAlertInputs(responseAPI.message, ()=>{
        let project = button.parentNode.parentNode.parentNode
        project.classList.add("scale0")
        setTimeout(()=> project.remove(), 200)
    })
}
async function reloadGitProject(id){
    let responseAPI = await fetch(`/admin/api/reload-gitId-project/${id}`).then(res=>res.json().then(json=>json))
    popUpAlertInputs(responseAPI.message)
}


document.addEventListener("DOMContentLoaded", ()=>{
    handleInputFileImage()
    handleCheckboxes()
    handleEventsButton()
    retrieveProjectDataFromAPI()
})
