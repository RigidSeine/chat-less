// /server/utils/get-room-users.jsx

function getRoomUsers(room, allUsers) {
    return allUsers.filter((user) => user.room == room);
};

module.exports = getRoomUsers;