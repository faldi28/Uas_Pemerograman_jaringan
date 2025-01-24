import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/register", { username, password });
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="container is-max-desktop p-4">
      <div className="box p-6">
        <h2 className="title is-5 has-text-centered mb-5">Register</h2>
        {error && (
          <p className="notification is-danger is-light has-text-centered mb-5">
            {error}
          </p>
        )}
        <form onSubmit={handleRegister}>
          <div className="field mb-4">
            <label className="label is-size-6">Username</label>
            <div className="control">
              <input
                className="input is-medium"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div className="field mb-4">
            <label className="label is-size-6">Password</label>
            <div className="control">
              <input
                className="input is-medium"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="field mb-4">
            <div className="control">
              <button className="button is-primary is-fullwidth">Register</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
