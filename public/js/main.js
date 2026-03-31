let message = document.getElementById("message");
let loginForm = document.getElementById("loginForm");
let signupForm = document.getElementById("signupForm")


// login event listener
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userLogin(e.target.elements.email.value, e.target.elements.password.value)
})
// signup event lister
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userRegistration(e.target.elements.name.value, e.target.elements.email.value, e.target.elements.password.value)
})

// login function 
async function userLogin(email, password) {
    const userData = {
        email: email,
        password: password
    }

    let url = "/api/auth/login"
    try {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        if (response.ok) {
            window.location.replace("/profile")
        }
        else {
            const errorMesaage = await response.json()
            message.innerText = errorMesaage.message;
            message.style.display = "block"
            setTimeout(function () {
                message.style.display = "none"
            }, 5000)
        }
    }
    catch (e) {
        console.log(e)
    }
}

// signup function 
async function userRegistration(name, email, password) {
    if (!name || !password  || !email) {
        message.innerText = "Kindly enter your all details"
        message.style.display = "block"
        return
    }
    const userData = {
        email: email,
        password: password,
        name: name
    }

    let url = "/api/auth/register"
    try {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        if (response.ok) {
            message.innerText = "Registeration Successful login Now !"
            message.style.display = "block"
            setTimeout(function () {
                message.style.display = "none"
            }, 3000)
        }
        else {
            const errorMesaage = await response.json()
            message.innerText = errorMesaage.message;
            message.style.display = "block"
            setTimeout(function () {
                message.style.display = "none"
            }, 5000)
        }
    }
    catch (e) {
        message.innerText = e;
        message.style.display = "block"
    }
}