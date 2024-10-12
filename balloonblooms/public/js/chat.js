const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const authStatus = document.getElementById('status');
const changeRoom = document.getElementById('changeRoom');

// Get username and room from URL
const locationPath = window.location.pathname.split('/')
const username = locationPath[locationPath.length-2]
const room = locationPath[locationPath.length-1].replace("+", " with ")

const socket = io();

// Get connection status
socket.on('status', (stat) => {
    if (stat) {
        console.log("connected");
    }
});

// Join chatroom
socket.emit('joinRoom', { username, room })

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});
    
// Message from server
socket.on('message', message => {
    outputMessage(message);
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Meassage join/ leave
socket.on('joinleave', message => {
    outputJoinLeave(message);
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Meassage request
socket.on('request', user => {
    outputRequest(user.username);
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault()
    // Get message text
    const msg = e.target.elements.msg.value;
    // Emit message to server
    socket.emit('chatMessage', msg);
    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username}
        <span class="ml-2">${message.time}</span></p>
    <p class="text is-size-5">
        ${message.text}
    </p>`;
    if (message.username.toLocaleLowerCase() == 'admin') {
        div.classList.add('has-background-primary')
    }
    document.querySelector('.chat-messages').appendChild(div);
}

// Output join/ leave to DOM
function outputJoinLeave(message) {
    const div = document.createElement('div');
    div.classList.add('notif');
    div.innerHTML = `<p class="is-size-6">${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Output request pc to DOM
function outputRequest(username) {
    const div = document.createElement('div');
    div.classList.add('request');
    div.innerHTML = `<p class="has-text-weight-bold">${username} request to Private Chat with Admin</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerHTML = room;
    roomName.title = 'Current in room ' + room;
    if (username.toLocaleLowerCase() != "admin" && room.substring(0, 10) != "ADMIN with") {
        changeRoom.innerHTML = `<a href="/live-chat/${username}/ADMIN+${username}" target="_blank" class="button is-info is-medium mb-5"><i class="fa-solid fa-lock mr-3"></i>Private Chat with Admin</a>`;
    }
    else if (room.substring(0, 10) == "ADMIN with"){
        changeRoom.innerHTML = `<a href="/live-chat/${username}/Public" target="_blank" class="button is-info is-medium mb-5"><i class="fa-solid fa-unlock mr-3"></i>Back to Public Live-Chat</a>`;
    }
}

// document.getElementById("private").onclick = () => {
//     outputRequest(username)
// }

// Add users to DOM
function outputUsers(users) {
    let temp = ""
    if (username.toLocaleLowerCase() == "admin") {
        users.forEach((user) => {
            if (user.username != username) {
                temp += `<li><i class="fas fa-user mr-2 is-size-5"></i><a href='/live-chat/${username}/ADMIN+${user.username}' target="_blank" class="text-decoration-none">${user.username}</a></li>`
            }
        });
    }
    else {
        users.forEach((user) => {
            if (user.username != username) {
                temp += `<li><i class="fa fa-user mr-2 is-size-5"></i>${user.username}</li>`
            }
        });
    }
    userList.innerHTML = `<li><i class="fas fa-child-reaching mr-2 is-size-5"></i>${username} <small>(you)</small></li>` + temp
}