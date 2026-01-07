import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const signup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name, email, password }
      );

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={signup}>
        <h2>Sign Up</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Create Account</button>

        <p className="switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
