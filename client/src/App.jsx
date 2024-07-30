//../src/App.jsx

import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { useState } from 'react'
import io from 'socket.io-client'
import Home from './pages/home'

const socket = io('http://localhost:5173/');

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
              }/>
          </Routes>
        </div>
    </Router>
  );
};

export default App;