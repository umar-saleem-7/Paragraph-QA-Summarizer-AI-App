import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles.css";
import bgRegister from "../assets/bg-default.jpg";
import logo from "../assets/logo-placeholder.png";

export default function Register() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [showRules, setShowRules] = useState(false);

  // Password rule checks
  const isLengthValid = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isPasswordStrong = isLengthValid && hasUppercase && hasLowercase && hasDigit && hasSpecial;

  const sendOTP = async (e) => {
    e.preventDefault();
    if (!isPasswordStrong) {
      setMsg("Password does not meet security requirements.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8000/check-user", {
        username,
        email,
      });
      if (!res.data.available) {
        setMsg("Username or Email already exists");
        return;
      }
      await axios.post("http://localhost:8000/request-otp", { email });
      setOtpSent(true);
      setMsg("OTP sent to email");
    } catch (err) {
      setMsg("Failed to send OTP");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMsg("Passwords do not match");
      return;
    }
    try {
      await axios.post("http://localhost:8000/signup", {
        username,
        email,
        password,
        otp,
      });
      setMsg("Registration successful! Please log in.");
      setTimeout(() => {
        nav("/login");
      }, 1500);
    } catch (err) {
      setMsg(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="bg-full" style={{ backgroundImage: `url(${bgRegister})` }}>
      <div className="auth-card fade-in">
        <img src={logo} alt="logo" className="logo-center" />
        <h3 className="text-center mb-3">Register</h3>

        <form onSubmit={otpSent ? handleRegister : sendOTP}>
          <input
            className="form-control mb-2"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="form-control mb-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {!otpSent ? (
            <>
              <input
                className="form-control mb-2"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowRules(true)}
                required
              />
              <input
                className="form-control mb-2"
                type="password"
                placeholder="Confirm Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />

              {showRules && (
                <div className="mb-2 p-2 rounded bg-light border" style={{ fontSize: "0.9rem" }}>
                  <strong>Password must contain:</strong>
                  <ul className="mb-1 mt-1">
                    <li style={{ color: isLengthValid ? "green" : "red" }}>
                      {isLengthValid ? "✔" : "❌"} At least 8 characters
                    </li>
                    <li style={{ color: hasUppercase ? "green" : "red" }}>
                      {hasUppercase ? "✔" : "❌"} One uppercase letter
                    </li>
                    <li style={{ color: hasLowercase ? "green" : "red" }}>
                      {hasLowercase ? "✔" : "❌"} One lowercase letter
                    </li>
                    <li style={{ color: hasDigit ? "green" : "red" }}>
                      {hasDigit ? "✔" : "❌"} One digit
                    </li>
                    <li style={{ color: hasSpecial ? "green" : "red" }}>
                      {hasSpecial ? "✔" : "❌"} One special character
                    </li>
                  </ul>
                </div>
              )}

              <button type="submit" className="btn btn-primary w-100">
                Send OTP
              </button>
            </>
          ) : (
            <>
              <input
                className="form-control mb-2"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-success w-100">
                Sign Up
              </button>
            </>
          )}
        </form>

        {msg && (
          <div
            className={`mt-2 text-center ${
              msg.toLowerCase().includes("otp sent") || msg.toLowerCase().includes("successful")
                ? "text-primary"
                : "text-danger"
            }`}
          >
            {msg}
          </div>
        )}

        <div className="text-center mt-3">
          <span>Already have an account? </span>
          <Link to="/login" className="text-primary fw-bold" style={{ textDecoration: "none" }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
