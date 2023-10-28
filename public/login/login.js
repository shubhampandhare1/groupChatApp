const baseUrl = 'http://localhost:3000';
async function login(event) {
    try {
        event.preventDefault();
        const user = {
            email: event.target.email.value,
            password: event.target.password.value,
        }
        const res = await axios.post(`${baseUrl}/user/login`, user)

    } catch (error) {
        console.log(error);
        showError(error);
    }
}

function showError(error){
    document.getElementById('error').innerHTML = `<p style="color:red">${error.response.data.message}</p>`
}