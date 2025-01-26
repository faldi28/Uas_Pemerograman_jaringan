import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const LoginUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/login", { username, password });
      console.log(data);  // Log data untuk melihat respons API
      if (data.role === "user") {
        localStorage.setItem("token", data.token);
        navigate("/dashboard-user");  // Arahkan ke halaman dashboard-user
      } else {
        setError("You are not authorized to access this page.");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials.");
    }
  };
  
  const handleGoToRegister = () => {
    navigate("/register-user");
  };

  return (
    <div className="container is-max-desktop p-4">
      <div className="box p-6">
        <h2 className="title is-5 has-text-centered mb-5">User Login</h2>
        {error && (
          <p className="notification is-danger is-light has-text-centered mb-5">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin}>
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
              <button className="button is-primary is-fullwidth">Login</button>
            </div>
          </div>
        </form>
        <div className="field">
          <div className="control">
            <button className="button is-link is-fullwidth" onClick={handleGoToRegister}>
              Register as User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;
