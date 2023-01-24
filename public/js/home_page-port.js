function redirectOcultLogin(){
    let imageProfile = document.querySelector(".technical-info-img-content")
    let count = 0
    imageProfile.addEventListener("click", ()=>{
        count++
        if(count === 8) return window.open("", "_blank").location.href = "/login"
    })
}


function createProjectsCards(array){
    let cardsHTML = ""
    array.forEach(card=>{
        cardsHTML += `
        <li class="card-project translateX">
            <div class="project-image-container">
                <img src="${card.cover}">
            </div>
            <article>
                <ul class="techs-list">
                    ${card.techs.map(tech=>`<li>${tech}</li>`).toString().replace(/,/g, "")}
                </ul>
                <h4>${card.type.replace(/-/ig, " ")}</h4>
                <h2>${card.name}</h2>
                <ul class="links-project-list">
                    <a href="${card.url}">Visitar<i class='bx bxs-hand-up'></i></a>
                    <a href="${card.repLink}">Repositório<i class='bx bxl-gitlab' ></i></a>
                </ul>
            </article>
        </li>
        `
    })
    if(document.querySelector(".card-project")){
        document.querySelectorAll(".projects-list .card-project").forEach((card, index)=>{
            setTimeout(()=>{
                card.classList.add("translateX")
            }, 100 *(index + 1))
            setTimeout(()=>card.remove(), 300 *(index + 1))
        })
    }
    document.querySelector(".projects-list").innerHTML = cardsHTML

    setTimeout(()=>{
        document.querySelectorAll(".projects-list .card-project").forEach((card, index)=>{
            setTimeout(()=>{
                card.classList.remove("translateX")
            }, 100 *(index + 1))
        })
    }, 400)
}

async function retrieveProjectDataFromAPI(){
    let projetos = await fetch("/public/api/get-projects").then(res=>res.json().then(json=>json.data))
    createProjectsCards(projetos)
    createProjectFilterClickEvents(projetos)
    addTechnologyPercentages(projetos)
}

function addTechnologyPercentages(projetos){
    let inputsPercents = document.querySelectorAll("[percent-techs] [percent-tech]")
    
    let techsRepsGit = projetos.map(projeto=> projeto.techsPercent).filter(tech=> tech)
    let sumTechs = {
        JavaScript: 0, 
        HTML: 0,
        CSS: 0,
        EJS: 0,
        Sass: 0,
        Scss: 0,
        Shell: 0
    }
    techsRepsGit.forEach(tech=>{
        for(let techKey in tech) sumTechs[techKey] += tech[techKey]
    })

    let calcPercent = ()=>{
        let sumTechsPercent = 0
        let techsValuePercent = {}
        let techsValuePercentLowerCases = {}
        for(let techKey in sumTechs) sumTechsPercent += Number(sumTechs[techKey])
        for(let techKey in sumTechs) techsValuePercent[techKey] = Math.round(((sumTechs[techKey] * 100) / sumTechsPercent))
        for(let techKey in techsValuePercent) techsValuePercentLowerCases[techKey.toLowerCase()] = techsValuePercent[techKey]
        return techsValuePercentLowerCases
    }
    console.log( calcPercent())


    let techsSelects = Array.from(inputsPercents).map(input=> input.id)
    techsSelects.forEach((tech, index)=>{
        inputsPercents[index].querySelector(".percent-display").innerHTML = calcPercent()[tech] + "%"
    })
    console.log(techsSelects)

}

function createProjectFilterClickEvents(projetos){
    let buttonsFilter = document.querySelectorAll("[controller-filter] [button-filter]")
    buttonsFilter.forEach((button, i, buttons)=>{
        button.addEventListener("click", ev=>{
            buttons.forEach(buttonF=> buttonF.classList.remove("mark-button-filter"))
            ev.target.classList.add("mark-button-filter")


            let typeProject = ev.target.id
            let projectsSelected = projetos.filter(projeto=>projeto.type === typeProject)
            if(typeProject === "all") return createProjectsCards(projetos)
            else return createProjectsCards(projectsSelected)
        })
    })
}
document.addEventListener("DOMContentLoaded", ()=>{
    redirectOcultLogin()
    retrieveProjectDataFromAPI()
})