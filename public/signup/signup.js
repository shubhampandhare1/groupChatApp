const baseUrl = 'http://16.171.111.145:3000';

async function signup(event){
    try{
        event.preventDefault();
        const user = {
            name: event.target.name.value,
            email: event.target.email.value,
            mobile: event.target.mobile.value,
            password: event.target.password.value,
        }
        
        const res = await axios.post(`${baseUrl}/user/signup`, user)
        alert(res.data.message);
        window.location.href = '../login/login.html';
    }
    catch(error){
        showError(error);
    }
}

function showError(error){
    document.getElementById('error').innerHTML = `<p style="color:red">${error.response.data.message}</p>`
}