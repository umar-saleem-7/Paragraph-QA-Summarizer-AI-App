import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css";
import bgDelete from "../assets/bg-default.jpg";
import logo from "../assets/logo-placeholder.png";

export default function DeleteAccount({ user, token }) {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/delete-account", { username: user, password }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      nav("/");
    } catch {
      setMsg("Failed to delete account");
    }
  };

  return (
    <div className="bg-full" style={{ backgroundImage: `url(${bgDelete})` }}>
      <div className="auth-card  fade-in">
        <img src={logo} alt="logo" className="logo-center" />
        <h4 className="text-center mb-3">Delete Account</h4>
        <form onSubmit={handleDelete}>
          <input className="form-control mb-2" type="password" placeholder="Confirm Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="btn btn-danger w-100">Delete</button>
        </form>
        {msg && <div className="text-danger mt-2">{msg}</div>}
      </div>
    </div>
  );
}
