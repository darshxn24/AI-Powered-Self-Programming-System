import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/login", {
        email,
        password,
      });
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("email", res.data.email);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.detail || "Login failed.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Log In</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
          <p onClick={() => navigate("/signup")}>
            Don’t have an account? <strong>Sign up here</strong>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
