
document.querySelector("#submit-form").addEventListener("click", login)


async function login(){
    const inputNameAdmin = document.querySelector("#name-admin")
    const inputPassword = document.querySelector("#password")
    if(!inputNameAdmin.value || !inputPassword.value || inputNameAdmin.value.length < 10 || inputPassword.value.length < 6) return

    let options = {
        method: "POST",
        body: JSON.stringify({nameAdmin: inputNameAdmin.value, password: inputPassword.value}),
        headers: new Headers({"Content-Type": "application/json"})
    }
    let responseLogin = await fetch("/public/auth/api/login", options).then(res=>res.json().then(json=>json))
    if(responseLogin.status) return location.href = "/admin/auth/auth/painel"
    else return alert(responseLogin.message)
}

