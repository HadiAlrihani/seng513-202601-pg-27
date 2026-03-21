import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Login from './pages/Login'
import CreateAccount from './pages/CreateAccount';

function App() {

  return (
    <Router>
      <div className='h-screen bg-white'>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/create-account' element={<CreateAccount />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
