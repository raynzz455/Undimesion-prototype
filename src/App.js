import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Welcome from './pages/welcome/welcome';
import Home from './pages/home/home';

function App() {
  const [udahWelcome, setUdahWelcome] = useState(false);

  useEffect(() => {
    const welcomeStatus = localStorage.getItem('udahWelcome');
    if (welcomeStatus === 'true') {
      setUdahWelcome(true);
    }
  }, []);

  const handleWelcome = () => {
    setUdahWelcome(true);
    localStorage.setItem('udahWelcome', 'true'); 
  };

  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<Welcome onWelcome={handleWelcome} />} />
        <Route path="/" element={udahWelcome ? <Home /> : <Navigate to="/welcome" />} />
      </Routes>
    </Router>
  );
}

export default App;
