const users = [];

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);    
}

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    users
};