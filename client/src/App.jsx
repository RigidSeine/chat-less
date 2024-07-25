//../src/App.jsx

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/home'

const App = () => {
  return(
    <Router>
        <div className='App'>
          <Routes>
            <Route path='/' element={<Home />}/>
          </Routes>
        </div>
    </Router>
  );
};

export default App;