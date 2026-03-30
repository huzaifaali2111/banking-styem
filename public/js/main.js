let loginEmail = document.getElementById("login_email");
let loginPassword = document.getElementById("login_password");
let loginBtn = document.getElementById("login_btn");
let loginForm = document.getElementById("loginForm");

loginForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    const formData = new formData(e.target)
    console.log(formData)
})
 
async function userLogin(email, password) {
    const userData = {
        email: email,
        password: password
    }
    let url = "/api/auth/login"
    try{
    let response = await fetch(url,{
        method : "POST",
        body : JSON.stringify(userData)
    })
    if(response.ok){
        console.log("okk")
    }
    }
    catch(e){}
}