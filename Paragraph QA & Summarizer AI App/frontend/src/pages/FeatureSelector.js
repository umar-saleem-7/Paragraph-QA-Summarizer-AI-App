import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";
import logo from "../assets/logo-placeholder.png";
import bgDefault from "../assets/bg-default.jpg";

export default function FeatureSelector({ onLogout }) {
  const nav = useNavigate();

  const goToSummarizer = () => nav("/summarizer");
  const goToPassageQA = () => nav("/dashboard");

  return (
    <div
      className="bg-full d-flex justify-content-center align-items-center"
      style={{ backgroundImage: `url(${bgDefault})`, minHeight: "100vh" }}
    >
      <div className="card-glass fade-in text-center p-4" style={{ width: "400px" }}>
        <img src={logo} alt="logo" className="logo-center mb-3" />
        <h4 className="mb-4">Select Feature</h4>

        <button
          className="btn btn-primary w-100 mb-3"
          onClick={goToPassageQA}
        >
          Passage-Based QA
        </button>

        <button
          className="btn btn-light w-100 mb-3"
          onClick={goToSummarizer}
        >
          Text Summarizer
        </button>

        <button
          className="btn btn-outline-danger w-100"
          onClick={() => {
            onLogout();
            nav("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
