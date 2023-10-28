const baseUrl = 'http://localhost:3000'
async function signup(event){
    event.preventDefault();
    try{
        const user = {
            name: event.target.name.value,
            email: event.target.email.value,
            mobile: event.target.mobile.value,
            password: event.target.password.value,
        }
        
        const res = await axios.post(`${baseUrl}/user/signup`, user)
        alert(res.data.message);
    }
    catch(error){
        console.log('err at axios.post',error);
        showError(error);
    }
}

function showError(error){
    document.getElementById('error').innerHTML = `<p style="color:red">${error.response.data.message}</p>`
}