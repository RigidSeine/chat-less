// server/utils/remove-user.jsx

function removeUser(userID, chatRoomUsers) {
    return chatRoomUsers.filter((user) => user.id != userID);
}

module.exports = removeUser;