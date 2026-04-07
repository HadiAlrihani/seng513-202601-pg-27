import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css'
import Login from './pages/Login'
import CreateAccount from './pages/CreateAccount';
import SelectGenres from './pages/selectGenres';
import Homepage from './pages/Homepage';
import FindClub from "./pages/FindClub";
import Profile from './pages/Profile';

function App() {

  return (
    <Router>
      <div className='h-screen bg-white font-inter'>
        <Routes>
          <Route index element={<Login />} />
          <Route path='/create-account' element={ <CreateAccount /> } />
          <Route path='/select-genres' element={ <SelectGenres /> } />
          <Route path='/home' element={ <Homepage /> } />
          <Route path='/profile' element={ <Profile />} />
          <Route path="/clubs" element={<FindClub />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
