import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');

  const requestOtp = async () => {
    try {
      const res = await axios.post('http://localhost:8000/request-otp', { email });
      if (res.data.success) {
        setStep(2);
      } else {
        setMessage(res.data.message);
      }
    } catch {
      setMessage('Error sending OTP');
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:8000/register', {
        username, email, otp, password
      });
      setMessage(res.data.message);
    } catch {
      setMessage('Error during registration');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      {step === 1 ? (
        <>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control"
                   value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button className="btn btn-primary" onClick={requestOtp}>Request OTP</button>
        </>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
          <div className="mb-3">
            <label>OTP</label>
            <input type="text" className="form-control"
                   value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Username</label>
            <input type="text" className="form-control"
                   value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control"
                   value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-success">Register</button>
        </form>
      )}
      {message && <div className="mt-3 text-info">{message}</div>}
    </div>
  );
}

export default Register;
