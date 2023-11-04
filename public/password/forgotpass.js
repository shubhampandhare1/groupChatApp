const baseUrl = 'http://localhost:3000'
function resetpass(event) {
    event.preventDefault();

    const email = event.target.email.value;

    axios.post(`${baseUrl}/password/forgotpassword`, { email })
        .then((res) => {
            console.log(res)
        })
        .catch(error => console.log(error));
}