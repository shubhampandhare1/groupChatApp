const baseUrl = 'http://localhost:3000';
const token = localStorage.getItem('token');

const socket = io(baseUrl);
const decodedToken = parseJwt(token);

// Send Message
document.getElementById('sendMsg').addEventListener('click', async () => {
    try {
        const msg = document.getElementById('msg').value;
        const groupId = localStorage.getItem('currGroup');

        if (!msg && !document.getElementById('mediaInput').files[0]) {
            return;
        }

        if (document.getElementById('mediaInput').files[0]) {
            const mediaFile = document.getElementById('mediaInput').files[0];
            const mediaType = mediaFile.type;
            const formData = new FormData();
            formData.append('media', mediaFile);
            formData.append('mediaType', mediaType);
            console.log('mediaFile>>>>>', formData)

            await axios.post(`${baseUrl}/user/mediasharing/${groupId}`, formData, {
                headers: { "Authorization": token, "Content-Type": 'multipart/form-data' }
            })
        }
        if (msg) {
            await axios.post(`${baseUrl}/user/sendmessage/${groupId}`, { msg }, { headers: { "Authorization": token } })
        }
        socket.emit('send-message', { msg, name: decodedToken.name });
        document.getElementById('msg').value = '';
        document.getElementById('mediaInput').value = '';
    }
    catch (error) {
        console.log('error at send message', error);
    }
});

socket.on('receive-message', message => {
    showMessagesOnScreen(message);
})

window.addEventListener('DOMContentLoaded', async () => {
    localStorage.setItem('chats', JSON.stringify([]));
    getmessage();
    showGroupsOnReload();
})

// Function to Get Messages
async function getmessage() {
    try {
        let chats = JSON.parse(localStorage.getItem('chats'));
        const groupId = localStorage.getItem('currGroup');
        if (!groupId) {
            return;
        }
        if (chats.length > 0) {
            while (chats.length > 10) {
                chats.shift();
            }
            const chatId = chats[chats.length - 1].id;
            const res = await axios.get(`${baseUrl}/user/getmessage?chatId=${chatId}&groupId=${groupId}`, { headers: { "Authorization": token } })
            const allChats = chats.concat(res.data.message);

            localStorage.setItem('chats', JSON.stringify(allChats));
            document.getElementById('chats').innerHTML = '';
            allChats.forEach(msg => {
                showMessagesOnScreen(msg);
            })
        }
        else {
            const res = await axios.get(`${baseUrl}/user/getmessage?chatId=0&groupId=${groupId}`, { headers: { "Authorization": token } })

            const allChats = res.data.message;

            localStorage.setItem('chats', JSON.stringify(allChats));
            document.getElementById('chats').innerHTML = '';
            allChats.forEach(msg => {
                showMessagesOnScreen(msg);
            })
        }
    } catch (error) {
        console.log('error occured at getmessage', error);
    }
}

// Function to show messages on screen
function showMessagesOnScreen(message) {
    const chats = document.getElementById('chats');
    const msg = document.createElement('p');
    if (decodedToken.name == message.name) {
        msg.innerText = `You: ${message.msg}`;
        msg.className = 'message curr-user-msg';
    } else {
        msg.innerText = `${message.name}: ${message.msg}`;
        msg.className = 'message other-user-msg';
    }
    chats.appendChild(msg);
}

document.getElementById('createGroup').addEventListener('click', () => {
    document.getElementById('groupForm').style.display = 'block';
})

document.getElementById('createGroupbtn').addEventListener('click', async () => {
    try {
        const groupName = document.getElementById('name').value;

        const res = await axios.post(`${baseUrl}/user/creategroup`, { groupName }, { headers: { "Authorization": token } })

        if (res.status == 201) {
            showGroups(res.data.group);
        }

    }
    catch (error) {
        console.log('error at creating group', error)
    }
})

function showGroups(groupData) {
    document.getElementById('groupForm').style.display = 'none';
    const group = document.createElement('li');
    group.id = groupData.id;
    group.innerHTML = `${groupData.name}`;
    group.addEventListener('click', () => {

        location.reload();

        const groupId = group.id;

        localStorage.setItem('currGroup', groupId);
        document.getElementById('chats').innerHTML = '';
        getmessage();
    })
    document.getElementById('listOfGroups').appendChild(group);
}

async function showGroupsOnReload() {
    try {
        const res = await axios.get(`${baseUrl}/user/getgroups`, { headers: { "Authorization": token } })

        const groups = res.data.groups;
        groups.forEach(ele => {
            showGroups(ele);
        });
    } catch (error) {
        console.log('error at showgrouponreload', error)
    }
}

document.getElementById('settings').addEventListener('click', () => {
    const currGroup = localStorage.getItem('currGroup');
    if (!currGroup) {
        alert('Select Group First');
        return;
    }
    window.location.href = '../setting/setting.html';
})

//parse JWT
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}