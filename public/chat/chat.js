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


window.addEventListener('DOMContentLoaded', async () => {
    getmessage();
})

// Function to Get Messages
async function getmessage() {
    try {
        let chats = JSON.parse(localStorage.getItem('chats'));
        let chatId;
        if (chats) {
            if (chats.length > 10) {
                chats.shift();
            }
            chatId = chats[chats.length - 1].id;
        } else {
            chatId = 0;
        }
        const res = await axios.get(`${baseUrl}/user/getmessage/${chatId}`, { headers: { "Authorization": token } })
        const allChats = chats.concat(res.data.message);

        localStorage.setItem('chats', JSON.stringify(allChats));
        document.getElementById('chats').innerHTML = '';
        allChats.forEach(msg => {
            showMessagesOnScreen(msg);
        })
    } catch (error) {
        console.log('error occured at getmessage',error);
    }
    finally {
        setTimeout(() => {
            getmessage();
        }, 1000);
    }
}

// Function to show messages on screen
function showMessagesOnScreen(message) {
    const chats = document.getElementById('chats');
    const msg = document.createElement('p');
    msg.innerText = `${message.name}: ${message.msg}`;

    chats.appendChild(msg);
}