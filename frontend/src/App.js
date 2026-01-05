import React, { useState } from "react";

/* ---------- BASIC STYLES ---------- */
const boxStyle = {
  width: "320px",
  margin: "60px auto",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  textAlign: "center",
  fontFamily: "Arial"
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px"
};

const buttonStyle = {
  padding: "8px 16px",
  margin: "5px",
  cursor: "pointer"
};
/* -------------------------------- */

const API_BASE = "https://healthy-beats-backend.onrender.com";

function App() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);

  const isLoggedIn = !!localStorage.getItem("token");

  /* ---------- SIGNUP ---------- */
  const handleSignup = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Signup successful ✅ Please login");
        setIsSignup(false);
        setName("");
        setPassword("");
      } else {
        setMessage(data.error || "Signup failed");
      }
    } catch {
      setMessage("Server error");
    }
  };

  /* ---------- LOGIN ---------- */
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMessage("Login success ✅");
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch {
      setMessage("Server error");
    }
  };

  /* ---------- PROFILE ---------- */
  const getProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please login first");
      return;
    }

    const res = await fetch(`${API_BASE}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      setProfile(data.user);
    } else {
      setMessage(data.error || "Unauthorized");
    }
  };

  /* ---------- LOGOUT ---------- */
  const logout = () => {
    localStorage.removeItem("token");
    setProfile(null);
    setEmail("");
    setPassword("");
    setMessage("Logged out");
  };

  return (
    <div style={boxStyle}>
      <h2>Healthy Beats</h2>

      {isSignup && (
        <input
          style={inputStyle}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <input
        style={inputStyle}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        style={inputStyle}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {isSignup ? (
        <button style={buttonStyle} onClick={handleSignup}>
          Signup
        </button>
      ) : (
        <button style={buttonStyle} onClick={handleLogin}>
          Login
        </button>
      )}

      <button
        style={buttonStyle}
        onClick={() => {
          setIsSignup(!isSignup);
          setMessage("");
        }}
      >
        {isSignup ? "Go to Login" : "Go to Signup"}
      </button>

      <p>{message}</p>

      <hr />

      <button
        style={buttonStyle}
        onClick={getProfile}
        disabled={!isLoggedIn}
      >
        Get Profile
      </button>

      <button style={buttonStyle} onClick={logout}>
        Logout
      </button>

      {profile && (
        <div style={{ marginTop: "20px" }}>
          <h3>Profile</h3>
          <p><b>Email:</b> {profile.email}</p>
        </div>
      )}
    </div>
  );
}

export default App;
