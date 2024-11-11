import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Authentication/Login";
import Register from "./components/Authentication/Register";
import Profile from "./components/Profile/Profile";
import NavBar from "./components/NavBar";
import './styles.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("token") !== null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(token !== null);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <NavBar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
        />
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
