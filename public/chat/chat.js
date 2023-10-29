const baseUrl = 'http://localhost:3000';
const token = localStorage.getItem('token');

// Send Message
document.getElementById('sendMsg').addEventListener('click', async () => {
    try {
        const msg = document.getElementById('msg').value;

        await axios.post(`${baseUrl}/user/sendmessage`, { msg }, { headers: { "Authorization": token } });
    }
    catch (error) {
        console.log(error);
    }
});

// Get Message
window.addEventListener('DOMContentLoaded', async () => {
    const messages = await axios.get(`${baseUrl}/user/getmessage`, { headers: { "Authorization": token } });
    console.log(messages.data.message);
    const data = messages.data.message;
    data.forEach(msg => {
        showMessagesOnScreen(msg)
    });
})

// Function to show messages on screen
function showMessagesOnScreen(message){
    const chats = document.getElementById('chats');
    const msg = document.createElement('p');
    msg.innerText = `${message.name}: ${message.msg}`;

    chats.appendChild(msg);
}