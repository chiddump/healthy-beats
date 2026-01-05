import { useState } from "react";

const API_BASE = "https://healthy-beats-backend.onrender.com";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);

  // ✅ SIGNUP
  const signup = async () => {
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Signup failed");
        return;
      }

      setMessage("Signup successful ✅");
    } catch (err) {
      setMessage("Server error");
    }
  };

  // ✅ LOGIN
  const login = async () => {
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      setMessage("Login successful ✅");
    } catch (err) {
      setMessage("Server error");
    }
  };

  // ✅ GET PROFILE
  const getProfile = async () => {
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Please login first");
        return;
      }

      const res = await fetch(`${API_BASE}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Unauthorized");
        return;
      }

      setProfile(data.user);
      setMessage("Profile loaded ✅");
    } catch (err) {
      setMessage("Server error");
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setProfile(null);
    setMessage("Logged out ✅");
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", textAlign: "center" }}>
      <h2>Healthy Beats</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={signup}>Signup</button>
      <button onClick={login} style={{ marginLeft: 10 }}>
        Login
      </button>

      <hr />

      <button onClick={getProfile}>Get Profile</button>
      <button onClick={logout} style={{ marginLeft: 10 }}>
        Logout
      </button>

      {message && <p>{message}</p>}

      {profile && (
        <div>
          <h4>Profile</h4>
          <p>ID: {profile.id}</p>
          <p>Email: {profile.email}</p>
        </div>
      )}
    </div>
  );
}

export default App;
