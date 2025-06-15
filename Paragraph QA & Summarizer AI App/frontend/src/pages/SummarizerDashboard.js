import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/logo-placeholder.png";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function SummarizerDashboard({ user, onLogout }) {
  const nav = useNavigate();
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/summarize", { text: inputText });
      setSummary(response.data.summary);
      setError("");
    } catch {
      setError("❌ Failed to generate summary.");
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-bg">
      <div className="sidebar-glass fade-in">
        <img src={logo} alt="logo" className="dashboard-logo" />
        <h5 className="text-center">Hello, {user}</h5>
        <button className="btn btn-light w-100 my-2" onClick={() => { onLogout(); nav("/"); }}>Logout</button>
        <button className="btn btn-outline-danger w-100" onClick={() => nav("/delete-account")}>Delete Account</button>
        <button className="btn btn-warning w-100 mt-2" onClick={() => nav("/select-feature")}>
    Back to Feature Selection
  </button>
        <button className="btn btn-info w-100 mt-2" onClick={() => nav("/contact-us")}>Contact Us</button>
      </div>

      <div style={{ flex: 1, padding: "30px" }}>
        <div className="card-glass mb-4 fade-in" style={{ maxWidth: "800px", margin: "auto" }}>
          <h3 className="text-center mb-3">📝 Text Summarizer</h3>
          <textarea
            className="form-control mb-2"
            rows="6"
            placeholder="Paste your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button className="btn btn-primary w-100" onClick={handleSummarize} disabled={loading}>
            {loading ? "Summarizing..." : "Summarize"}
          </button>

          {error && <div className="text-danger mt-3">{error}</div>}

          {summary && (
            <div className="alert alert-info mt-4">
              <h5>📌 Summary:</h5>
              <p>{summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
