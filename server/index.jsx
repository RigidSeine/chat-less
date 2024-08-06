//server/index.jsx

const express = require('express');
const app = express();
http = require('http');
const cors = require('cors');
const {Server} = require('socket.io');

app.use(cors()); //Adds cors middleware

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', //Add our client to the whitelist for CORS
        methods: ['GET', 'POST']
    }
});

//Listen for when a client connects via socket.io-client.
io.on('connection', (socket) => {
    console.log(`User connected with ID: ${socket.id}`);

    socket.on('join_room', (data) => {
        const {username, room}  = data; //Expecting username and room to be returned by the client
        socket.join(room); 
    }
    )
});

//Set up the port that server is running on
server.listen(4000, () => 'Server is listening on port 4000!');