import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DeleteAccount from "./pages/DeleteAccount";
import ContactUs from "./pages/ContactUs";
import FeatureSelector from './pages/FeatureSelector';
import SummarizerDashboard from './pages/SummarizerDashboard';
import "./styles.css";

function App() {
  const [user, setUser] = useState(localStorage.getItem("username"));

  const handleLogin = (username, token) => {
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route
          path="/summarizer"
          element={user ? <SummarizerDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route
          path="/select-feature"
          element={user ? <FeatureSelector user={user} onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route path="/delete-account" element={<DeleteAccount user={user} />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}

export default App;
