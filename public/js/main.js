
let loginForm = document.getElementById("loginForm");

loginForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    userLogin(e.target.elements.email.value, e.target.elements.password.value)
})

// login function 
async function userLogin(email, password) {
    const userData = {
        email: email,
        password: password
    }
    
    let url = "/api/auth/login"
    try{
    let response = await fetch(url,{
        method : "POST", 
        headers: {
        'Content-Type': 'application/json' 
      },
        body : JSON.stringify(userData)
    })
    if(response.ok){
        console.log(response)
    }
    else{
        console.log(response)
    }
    }
    catch(e){
        console.log(e)
    }
}