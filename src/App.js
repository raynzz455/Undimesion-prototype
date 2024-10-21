import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Welcome from './pages/welcome/welcome';
import Home from './pages/home/home';
import Navbar from './components/navbar/Navbar';

function App() {
  const location = useLocation(); 
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
    <>
      {location.pathname !== '/welcome' && <Navbar />}
      <Routes>
        <Route path="/welcome" element={<Welcome onWelcome={handleWelcome} />} />
        <Route path="/" element={udahWelcome ? <Home /> : <Navigate to="/welcome" />} />
      </Routes>
    </>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
