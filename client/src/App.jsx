//../src/App.jsx

import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { useState } from 'react'
import io from 'socket.io-client'
import Home from './pages/home'
import Chat from './pages/chat'

const socket = io.connect('http://localhost:4000/');

const App = () => {
  const[username, setUsername] = useState('');
  const[room, setRoom] = useState('');

  return(
    <Router>
        <div className='App'>
          <Routes>
            <Route //Declare what element is displayed at this path
              path='/' 
              element={
                <Home //Pass the state of the constants down to Home - i.e. use Props
                  username={username}
                  setUsername={setUsername}
                  room={room}
                  setRoom={setRoom}
                  socket={socket}
                />
              }
            />
            <Route 
              path='/chat'
              element={
                <Chat 
                  username={username}
                  room={room}
                  socket={socket}
                />
              }
            />
          </Routes>
        </div>
    </Router>
  );
};

export default App;