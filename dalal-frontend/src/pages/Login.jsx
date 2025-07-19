// src/pages/Login.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/dalal/login", {
        username: username,
        password: password,
      });
      localStorage.setItem("token", res.data.access);
      setAuth(res.data.access);
      navigate("/profile");
    } catch (err) {
      console.log(err);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="form-card">
      <h2 className="text-2xl font-semibold">Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default Login;
