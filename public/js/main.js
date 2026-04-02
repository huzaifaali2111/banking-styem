let message = document.getElementById("message");
let loginForm = document.getElementById("loginForm");
let signupForm = document.getElementById("signupForm");
let accoutOpeningForm = document.getElementById("accoutOpeningForm");
let accountAlert = document.getElementById("account-alert");

if (loginForm && signupForm) {

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

}

if (accoutOpeningForm) {
    // account opening form event listener
    accoutOpeningForm.addEventListener("submit", (e) => {
        e.preventDefault();
        userAccount(e.target.elements.name.value, e.target.elements.cnic.value, e.target.elements.fatherName.value, e.target.elements.birthdate.value, e.target.elements.address.value, e.target.elements.phoneNumber.value)
    })
}

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
    if (!name || !password || !email) {
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

// account opening function
async function userAccount(name, cnic, fatherName, birthdate, address, phoneNumber) {
    const userData = {
        name: name,
        cnic: cnic,
        fatherName: fatherName,
        birthdate: birthdate,
        address: address,
        phoneNumber: phoneNumber
    }
    try {
        let url = "/api/accounts/new-account"
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "appliaction/json"
            },
            body: JSON.stringify(userData)
        })
        if (response.ok) {
            accountAlert.innerHTML = `<li>${response}</li>`;
            accountAlert.style.display = "block"
        }
        const data = await response.json()
        console.log(data)

        accountAlert.innerHTML = `<li>${data}</li>`;
        accountAlert.style.display = "block"

    } catch (error) {
        accountAlert.innerHTML = `<li>${error}</li>`;
        accountAlert.style.display = "block"
    }
}