const baseUrl = 'http://16.171.64.230:3000';
async function login(event) {
    try {
        event.preventDefault();
        
        const user = {
            email: event.target.email.value,
            password: event.target.password.value,
        }

        const res = await axios.post(`${baseUrl}/user/login`, user);
        alert(res.data.message);
        window.location.href = '../chat/chat.html';
        localStorage.setItem('token', res.data.token);

    } catch (error) {
        console.log(error);
        showError(error);
    }
}

function showError(error){
    console.log(error)
    document.getElementById('error').innerHTML = `<p style="color:red">${error.message }</p>`
}