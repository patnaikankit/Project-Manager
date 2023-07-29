import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './components/Home/home.jsx'
import Auth from './components/Auth/auth.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Auth />}/>
          <Route path="/signup" element={<Auth signup/>}/>
          <Route path="/account" element={<h1>Account</h1>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
