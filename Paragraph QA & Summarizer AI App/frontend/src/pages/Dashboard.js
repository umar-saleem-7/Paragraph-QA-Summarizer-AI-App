import React, { useState } from "react";
import axios from "axios";
import logo from "../assets/logo-placeholder.png";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function Dashboard({ user, onLogout }) {
  const nav = useNavigate();
  const [passage, setPassage] = useState("");
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [latestAnswer, setLatestAnswer] = useState("");

  const ask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/qa", { passage, question });
      const answer = res.data.answer;
      setHistory([...history, { q: question, a: answer }]);
      setLatestAnswer(answer);
      setQuestion("");
      setError("");
    } catch {
      setError("Failed to get answer");
    }
  };

  return (
    <div className="dashboard-bg">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px" }}>
        <div className="card-glass mb-4 fade-in" style={{ maxWidth: "800px", margin: "auto" }}>
          <h3 className="text-center mb-3">Passage-Based Question Answering</h3>
          <form onSubmit={ask}>
            <textarea
              className="form-control mb-2"
              rows="4"
              placeholder="Enter passage..."
              value={passage}
              onChange={(e) => setPassage(e.target.value)}
              required
            />
            <input
              className="form-control mb-2"
              placeholder="Your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
            <button className="btn btn-primary w-100">Get Answer</button>
          </form>

          {error && <div className="text-danger mt-2">{error}</div>}

          {latestAnswer && (
            <div className="mt-4">
              <span
                style={{
                  fontWeight: "bold",
                  color: "#ffc107",
                  fontSize: "1.2rem",
                  display: "inline-block",
                  marginBottom: "5px",
                }}
              >
                Answer:
              </span>{" "}
              <span style={{ color: "white", fontSize: "1rem", fontWeight: "500" }}>
                {latestAnswer}
              </span>
            </div>
          )}
        </div>

        {/* Session History */}
        {history.length > 0 && (
          <div className="card-glass mt-4 fade-in" style={{ maxWidth: "800px", margin: "auto" }}>
            <h4 className="text-center mb-3">Session History</h4>
            <div className="session-history">
              {history.map((h, i) => (
                <div key={i} className="mb-3">
                  <strong>Q:</strong> {h.q}<br />
                  <strong style={{ color: "#ffc107" }}>A:</strong> <span style={{ color: "white" }}>{h.a}</span>
                  <hr />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
