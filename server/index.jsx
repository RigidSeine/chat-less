//server/index.jsx

const express = require('express');
const app = express();
http = require('http');
const cors = require('cors');
const {Server} = require('socket.io');
const mongodbSaveMessage = require ('./services/mongodb-save-message.jsx');
const mongodbGetMessages = require ('./services/mongodb-get-messages.jsx');

require('dotenv').config();

app.use(cors()); //Adds cors middleware

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', //Add our client to the whitelist for CORS
        methods: ['GET', 'POST']
    }
});

const chatbot = 'ChatBot'; //Chatbot for making room-wide announcements
let chatRoom = '';
let allUsers = [];

//Listen for when a client connects via socket.io-client.
io.on('connection', (socket) => {
    console.log(`User connected with ID: ${socket.id}`);

    //Join room event listener
    socket.on('join_room', (data) => {
        const {username, room}  = data; //Expecting username and room to be returned by the client
        socket.join(room); //Join the user to a socket room
        
        //Get the last 100 messages sent in the chat room
        mongodbGetMessages(room)
        .then((last100Messages) => {
            socket.emit('last_100_messages', last100Messages);
         })
        .catch((err) => { console.err(err)});
        
        let createdTime = Date.now();

        //Send message to all users joined to the room
        //Emit the 'receive_message' event and pass through an object with some details about the event
        socket.to(room).emit('receive_message', {
            message: `${username} has joined the chat room`,
            username: chatbot,
            createdTime //Note the shorthand notation - this is the equivalent of createdTime: createdTime
        });

        //Send a welcome message to only the user
        socket.emit('receive_message', {
            message: `Welcome ${username}`,
            username: chatbot,
            createdTime
        });
    
        chatRoom = room;
        allUsers.push({id: socket.id, username, room});
        
        var chatRoomUsers = allUsers.filter((user) => user.room == room);
        socket.to(room).emit('chatroom_users', chatRoomUsers); //Emit the list of chatroom users so that the list of users can be displayed in the room on the frontend
        socket.emit('chatroom_users', chatRoomUsers);
    });

    //Send message event listener
    socket.on('send_message', (data) => {
        const {message, room, username, createdTime } = data;

        io.in(room).emit('receive_message', data); //Send the message to all users in the room
        
        mongodbSaveMessage(message, username, room, createdTime) //Write the message to the database
        .then((response) => console.log(response))
        .catch((err) => console.error('Error trying to fire mongodbSaveMessage: ', err));
    });
});

//Set up the port that server is running on
server.listen(4000, () => 'Server is listening on port 5173!');

console.log('server running');