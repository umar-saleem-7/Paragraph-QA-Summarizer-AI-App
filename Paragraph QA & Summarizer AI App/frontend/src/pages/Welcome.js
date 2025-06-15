import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-placeholder.png";
import "../styles.css";
import bgWelcome from "../assets/bg-welcome.jpg";

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="bg-full" style={{ backgroundImage: `url(${bgWelcome})` }}>
      <div className="card-glass text-center fade-in">
        <img src={logo} alt="logo" className="logo-center zoom-in" />
        <h1 className="mt-3">Welcome to PassageQA <br />& <br />Text Summarizer</h1>
        <div className="mt-4">
          <button className="btn btn-primary me-3" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/register")}>
            Register
          </button>
          <div className="mt-3">
            <button
            className="btn btn-info text-white fw-bold px-4 py-2 shadow"
            style={{ border: "2px solid #0dcaf0", fontSize: "16px" }}
            onClick={() => navigate("/contact-us")}
            >
            Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
