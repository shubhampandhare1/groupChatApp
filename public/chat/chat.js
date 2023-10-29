const baseUrl = 'http://localhost:3000';
const token = localStorage.getItem('token');

document.getElementById('sendMsg').addEventListener('click', async () => {
    try{
        const msg = document.getElementById('msg').value;
        console.log(msg)
        await axios.post(`${baseUrl}/user/sendmessage`, { msg }, { headers: { "Authorization": token } });
    }
    catch(error){
        console.log(error);
    }
});