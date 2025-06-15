import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles.css";
import bgLogin from "../assets/bg-default.jpg";
import logo from "../assets/logo-placeholder.png";

export default function Login({ onLogin }) {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/login", {
        username,
        password,
      });

      // Call parent's login handler
      onLogin(username, res.data.access_token);

      // Navigate to feature selection page
      nav("/select-feature", { state: { user: username } });
    } catch (err) {
      setMsg(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="bg-full" style={{ backgroundImage: `url(${bgLogin})` }}>
      <div className="auth-card fade-in">
        <img src={logo} alt="logo" className="logo-center" />
        <h3 className="text-center mb-3">Login</h3>
        <form onSubmit={handleLogin}>
          <input
            className="form-control mb-2"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="form-control mb-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn btn-primary w-100">Login</button>
        </form>

        {msg && (
          <div
            className={`mt-2 text-center ${
              msg.toLowerCase().includes("success")
                ? "text-primary"
                : "text-danger"
            }`}
          >
            {msg}
          </div>
        )}

        <div className="text-center mt-3">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-primary fw-bold" style={{ textDecoration: "none" }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
