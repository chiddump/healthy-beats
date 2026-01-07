import { useState } from "react";
import axios from "axios";
import "./Login.css";

function Signup() {
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const signup = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/signup",
        form
      );
      setSuccess("Signup successful 🎉 Please login");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account 🌱</h2>

        <input placeholder="Name" onChange={e => setForm({...form, name:e.target.value})} />
        <input placeholder="Email" onChange={e => setForm({...form, email:e.target.value})} />
        <input type="password" placeholder="Password" onChange={e => setForm({...form, password:e.target.value})} />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button onClick={signup}>Signup</button>
      </div>
    </div>
  );
}

export default Signup;
